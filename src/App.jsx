import React, { useState, useEffect, useCallback } from 'react';
import ChannelToggle from './components/ChannelToggle';
import { usePolling } from './hooks/usePolling';
import { getQuotaStatus } from './services/newsApi';
import { requestPushPermission, getPushPermission, dispatchNotification } from './services/notifications';
import { US_STATES, IDAHO_REGIONS, SOURCE_MAP } from './data/geography';
import { FEDERAL_FEEDS, STATE_FEEDS, LOCAL_FEEDS } from './data/govFeeds';
import { PROVIDERS } from './services/newsApi';
import { fetchAllGovWatchers } from './services/govWatch';

// ─── localStorage helpers ────────────────────────────────────────────
function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ─── Default state ───────────────────────────────────────────────────
const DEFAULT_SETTINGS = {
  pollingInterval: 5,
  turboMode: false,
  quietHoursEnabled: false,
  quietFrom: '22:00',
  quietTo: '07:00',
  digestTime: '07:00',
  emailAddress: '',
  slackWebhook: '',
};

const DEFAULT_WATCHER = {
  name: '',
  keywords: [],
  excludeKeywords: [],
  trackedEntities: [],
  geoState: 'Idaho',
  geoRegion: '',
  geoCustom: '',
  dateMode: 'rolling',
  rollingDays: 7,
  dateFrom: '',
  dateTo: '',
  active: true,
  alertMode: 'instant',
  channels: { push: true, email: false, slack: false },
  sourceTypeFilter: [],
};

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ─── App ─────────────────────────────────────────────────────────────
export default function App() {
  // State
  const [watchers, setWatchers] = useState(() => loadJSON('jwatch_watchers', []));
  const [notifications, setNotifications] = useState(() => loadJSON('jwatch_notifications', []));
  const [settings, setSettings] = useState(() => loadJSON('jwatch_settings', DEFAULT_SETTINGS));
  const [activeTab, setActiveTab] = useState('feed');
  const [selectedWatcher, setSelectedWatcher] = useState(null);
  const [showWatcherForm, setShowWatcherForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editingWatcher, setEditingWatcher] = useState(null);
  const [showExcluded, setShowExcluded] = useState(false);

  // Gov Watchers
  const [govWatchers, setGovWatchers] = useState(() => loadJSON('jwatch_gov_watchers', []));
  const [showGovWatcherForm, setShowGovWatcherForm] = useState(false);
  const [selectedGovWatcher, setSelectedGovWatcher] = useState(null);
  const [govArticles, setGovArticles] = useState(() => loadJSON('jwatch_gov_articles', []));
  const [govPolling, setGovPolling] = useState(false);
  const [govLastPoll, setGovLastPoll] = useState(() => {
    const saved = localStorage.getItem('jwatch_gov_lastPoll');
    return saved ? new Date(saved) : null;
  });
  const [govError, setGovError] = useState(null);

  // Polling
  const { articles, excluded, isPolling, lastPoll, error, pollNow } = usePolling(watchers, settings);

  // Gov Watch polling
  const pollGov = useCallback(async () => {
    const active = govWatchers.filter(gw => gw.active);
    if (active.length === 0) return;
    setGovPolling(true);
    setGovError(null);
    try {
      const results = await fetchAllGovWatchers(active);
      setGovArticles(results);
      setGovLastPoll(new Date());
    } catch (err) {
      console.error('[GovWatch] Poll error:', err);
      setGovError(err.message);
    } finally {
      setGovPolling(false);
    }
  }, [govWatchers]);

  // Auto-poll Gov Watch on interval
  useEffect(() => {
    const active = govWatchers.filter(gw => gw.active);
    if (active.length === 0) return;
    pollGov();
    const interval = setInterval(pollGov, (settings.pollingInterval || 5) * 60 * 1000);
    return () => clearInterval(interval);
  }, [govWatchers, pollGov, settings.pollingInterval]);

  // Persist to localStorage
  useEffect(() => { saveJSON('jwatch_watchers', watchers); }, [watchers]);
  useEffect(() => { saveJSON('jwatch_notifications', notifications); }, [notifications]);
  useEffect(() => { saveJSON('jwatch_settings', settings); }, [settings]);
  useEffect(() => { saveJSON('jwatch_gov_watchers', govWatchers); }, [govWatchers]);
  useEffect(() => { saveJSON('jwatch_gov_articles', govArticles); }, [govArticles]);
  useEffect(() => { if (govLastPoll) localStorage.setItem('jwatch_gov_lastPoll', govLastPoll.toISOString()); }, [govLastPoll]);

  // Handle new matched articles → create notifications
  const prevArticleCountRef = React.useRef(0);
  useEffect(() => {
    if (articles.length > prevArticleCountRef.current && prevArticleCountRef.current > 0) {
      const newArticles = articles.slice(0, articles.length - prevArticleCountRef.current);
      for (const article of newArticles.slice(0, 5)) {
        const watcher = watchers.find(w => w.id === article.matchedWatcherId);
        if (watcher) {
          // Create notification record
          const notif = {
            id: generateId(),
            watcherId: watcher.id,
            watcherName: watcher.name,
            articleId: article.url,
            articleTitle: article.title,
            articleSource: article.source,
            timestamp: new Date().toISOString(),
            read: false,
            alertMode: watcher.alertMode,
          };
          setNotifications(prev => [notif, ...prev].slice(0, 100));

          // Dispatch push/email/slack
          if (watcher.alertMode === 'instant') {
            dispatchNotification(article, watcher, settings);
          }
        }
      }
    }
    prevArticleCountRef.current = articles.length;
  }, [articles, watchers, settings]);

  // ─── Watcher CRUD ──────────────────────────────────────────────────
  const createWatcher = useCallback((data) => {
    const watcher = { ...DEFAULT_WATCHER, ...data, id: generateId(), createdAt: new Date().toISOString() };
    setWatchers(prev => [...prev, watcher]);
    setShowWatcherForm(false);
    setEditingWatcher(null);
  }, []);

  const updateWatcher = useCallback((id, updates) => {
    setWatchers(prev => prev.map(w => w.id === id ? { ...w, ...updates, updatedAt: new Date().toISOString() } : w));
    setShowWatcherForm(false);
    setEditingWatcher(null);
  }, []);

  const deleteWatcher = useCallback((id) => {
    setWatchers(prev => prev.filter(w => w.id !== id));
    if (selectedWatcher === id) setSelectedWatcher(null);
  }, [selectedWatcher]);

  const toggleWatcher = useCallback((id) => {
    setWatchers(prev => prev.map(w => w.id === id ? { ...w, active: !w.active } : w));
  }, []);

  // ─── Gov Watcher CRUD ─────────────────────────────────────────────
  const createGovWatcher = useCallback((feed, level) => {
    const gw = {
      id: generateId(),
      feedId: feed.id,
      name: feed.name,
      category: feed.category,
      level,
      feedUrl: feed.url,
      active: true,
      createdAt: new Date().toISOString(),
    };
    setGovWatchers(prev => [...prev, gw]);
    setShowGovWatcherForm(false);
  }, []);

  const deleteGovWatcher = useCallback((id) => {
    setGovWatchers(prev => prev.filter(gw => gw.id !== id));
    if (selectedGovWatcher === id) setSelectedGovWatcher(null);
  }, [selectedGovWatcher]);

  const toggleGovWatcher = useCallback((id) => {
    setGovWatchers(prev => prev.map(gw => gw.id === id ? { ...gw, active: !gw.active } : gw));
  }, []);

  // ─── Notifications ─────────────────────────────────────────────────
  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  // ─── Quota ─────────────────────────────────────────────────────────
  const quota = getQuotaStatus();

  // ─── Filtered articles ─────────────────────────────────────────────
  const displayArticles = selectedWatcher
    ? articles.filter(a => a.matchedWatcherId === selectedWatcher)
    : articles;

  const displayExcluded = selectedWatcher
    ? excluded.filter(a => a.matchedWatcherId === selectedWatcher)
    : excluded;

  // Gov Watch filtered articles
  const displayGovArticles = selectedGovWatcher
    ? govArticles.filter(a => a.govWatcherId === selectedGovWatcher)
    : govArticles;

  // ─── Render ────────────────────────────────────────────────────────
  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar__header">
          <div className="sidebar__title">J Watch</div>
          <div className="sidebar__subtitle">Geo-targeted news monitoring</div>
        </div>

        {/* Watchers */}
        <div className="sidebar__section">
          <div className="sidebar__section-title">Watchers</div>
          {watchers.map(w => (
            <div
              key={w.id}
              className={`watcher-card ${w.id === selectedWatcher ? 'active' : ''} ${!w.active ? 'inactive' : ''}`}
              onClick={() => { setSelectedWatcher(w.id === selectedWatcher ? null : w.id); setSelectedGovWatcher(null); setActiveTab('feed'); }}
            >
              <div className="watcher-card__name">{w.name || 'Unnamed'}</div>
              <div className="watcher-card__meta">
                <span>{(w.keywords || []).join(', ') || 'No keywords'}</span>
                {w.geoState && <span>{w.geoState}</span>}
                {w.geoRegion && <span>{w.geoRegion}</span>}
              </div>
              <div className="watcher-card__actions">
                <button className="btn btn--sm" onClick={(e) => { e.stopPropagation(); toggleWatcher(w.id); }}>
                  {w.active ? 'Pause' : 'Resume'}
                </button>
                <button className="btn btn--sm" onClick={(e) => { e.stopPropagation(); setEditingWatcher(w); setShowWatcherForm(true); }}>
                  Edit
                </button>
                <button className="btn btn--sm btn--danger" onClick={(e) => { e.stopPropagation(); deleteWatcher(w.id); }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
          <button className="btn btn--primary" style={{ width: '100%', marginTop: 8 }} onClick={() => { setEditingWatcher(null); setShowWatcherForm(true); }}>
            + New Watcher
          </button>
        </div>

        {/* Gov Watchers */}
        <div className="sidebar__section">
          <div className="sidebar__section-title gov-section-title">Gov Watch</div>
          {govWatchers.map(gw => (
            <div
              key={gw.id}
              className={`watcher-card gov-watcher-card ${gw.id === selectedGovWatcher ? 'active' : ''} ${!gw.active ? 'inactive' : ''}`}
              onClick={() => { setSelectedGovWatcher(gw.id === selectedGovWatcher ? null : gw.id); setSelectedWatcher(null); setActiveTab('gov'); }}
            >
              <div className="watcher-card__name">{gw.name}</div>
              <div className="watcher-card__meta">
                <span>{gw.category}</span>
                <span className="gov-level-tag">{gw.level}</span>
              </div>
              <div className="watcher-card__actions">
                <button className="btn btn--sm" onClick={(e) => { e.stopPropagation(); toggleGovWatcher(gw.id); }}>
                  {gw.active ? 'Pause' : 'Resume'}
                </button>
                <button className="btn btn--sm btn--danger" onClick={(e) => { e.stopPropagation(); deleteGovWatcher(gw.id); }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
          <button className="btn btn--gov" style={{ width: '100%', marginTop: 8 }} onClick={() => setShowGovWatcherForm(true)}>
            + New Gov Watcher
          </button>
        </div>

        {/* Quota */}
        <div className="sidebar__section">
          <div className="sidebar__section-title">API Quota</div>
          <div className="quota-display">
            {['newsapi', 'gnews', 'newsdata'].map(provider => {
              const q = quota[provider];
              const pct = q.limit === Infinity ? 0 : (q.used / q.limit) * 100;
              const cls = pct > 80 ? 'danger' : pct > 60 ? 'warning' : '';
              return (
                <div key={provider} className="quota-bar">
                  <span className="quota-bar__label">{provider}</span>
                  <div className="quota-bar__track">
                    <div className={`quota-bar__fill ${cls}`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="quota-bar__count">{q.used}/{q.limit === Infinity ? '∞' : q.limit}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Settings button */}
        <div className="sidebar__section" style={{ borderBottom: 'none', marginTop: 'auto' }}>
          <button className="btn" style={{ width: '100%' }} onClick={() => setShowSettings(true)}>
            Settings
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="main">
        {/* Header */}
        <div className="header">
          <div className="header__brand">
            <span className="header__logo">J Watch</span>
            <span className="header__tagline">Geo-targeted news monitoring for journalists</span>
          </div>
          <div className="header__actions">
            <button className="btn btn--sm" onClick={pollNow} disabled={isPolling}>
              {isPolling ? 'Polling...' : 'Poll Now'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button className={`tab ${activeTab === 'feed' ? 'active' : ''}`} onClick={() => setActiveTab('feed')}>
            Feed
            {displayArticles.length > 0 && <span className="tab__badge">{displayArticles.length}</span>}
          </button>
          <button className={`tab ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>
            Notifications
            {unreadCount > 0 && <span className="tab__badge">{unreadCount}</span>}
          </button>
          {govWatchers.length > 0 && (
            <button className={`tab ${activeTab === 'gov' ? 'active' : ''}`} onClick={() => setActiveTab('gov')}>
              Gov Watch
              {displayGovArticles.length > 0 && <span className="tab__badge tab__badge--gov">{displayGovArticles.length}</span>}
            </button>
          )}
          <button className={`tab ${activeTab === 'sources' ? 'active' : ''}`} onClick={() => setActiveTab('sources')}>
            Sources
          </button>
        </div>

        {/* Content */}
        <div className="content">
          {activeTab === 'feed' && (
            <>
              {error && (
                <div style={{ padding: '12px 16px', marginBottom: 12, background: 'var(--danger-dim)', border: '1px solid var(--danger)', borderRadius: 'var(--radius)', fontSize: 13 }}>
                  Polling error: {error}
                </div>
              )}

              {displayArticles.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state__icon">&#128270;</div>
                  <div className="empty-state__title">No articles yet</div>
                  <div className="empty-state__text">
                    {watchers.length === 0
                      ? 'Create a watcher to start monitoring news.'
                      : 'Click "Poll Now" to fetch articles, or wait for the next automatic poll.'}
                  </div>
                </div>
              ) : (
                <>
                  {displayExcluded.length > 0 && (
                    <div style={{ marginBottom: 12, fontSize: 13, color: 'var(--text-muted)' }}>
                      {displayArticles.length} results ({displayExcluded.length} excluded)
                      <button
                        className="btn btn--sm"
                        style={{ marginLeft: 8 }}
                        onClick={() => setShowExcluded(!showExcluded)}
                      >
                        {showExcluded ? 'Hide excluded' : 'Show excluded'}
                      </button>
                    </div>
                  )}

                  {displayArticles.map((article, i) => (
                    <ArticleCard key={article.url || i} article={article} />
                  ))}

                  {showExcluded && displayExcluded.map((article, i) => (
                    <div key={`excl-${i}`} style={{ opacity: 0.5 }}>
                      <ArticleCard article={article} excluded />
                    </div>
                  ))}
                </>
              )}
            </>
          )}

          {activeTab === 'notifications' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 style={{ fontSize: 16 }}>Notifications</h3>
                {notifications.length > 0 && (
                  <button className="btn btn--sm" onClick={markAllRead}>Mark all read</button>
                )}
              </div>

              {notifications.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state__icon">&#128276;</div>
                  <div className="empty-state__title">No notifications</div>
                  <div className="empty-state__text">Notifications will appear here when articles match your watchers.</div>
                </div>
              ) : (
                notifications.map(n => (
                  <div key={n.id} className={`notification-item ${n.read ? '' : 'unread'}`}>
                    <div className="notification-item__content">
                      <div className="notification-item__title">{n.articleTitle}</div>
                      <div className="notification-item__meta">
                        {n.watcherName} &middot; {n.articleSource} &middot; {new Date(n.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === 'gov' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontSize: 16 }}>
                  Gov Watch
                  {selectedGovWatcher && (
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 400, marginLeft: 8 }}>
                      {govWatchers.find(gw => gw.id === selectedGovWatcher)?.name}
                    </span>
                  )}
                </h3>
                <button className="btn btn--sm" onClick={pollGov} disabled={govPolling}>
                  {govPolling ? 'Fetching...' : 'Refresh'}
                </button>
              </div>

              {govError && (
                <div style={{ padding: '12px 16px', marginBottom: 12, background: 'var(--danger-dim)', border: '1px solid var(--danger)', borderRadius: 'var(--radius)', fontSize: 13 }}>
                  Gov Watch error: {govError}
                </div>
              )}

              {displayGovArticles.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state__icon">&#127963;</div>
                  <div className="empty-state__title">No government updates</div>
                  <div className="empty-state__text">
                    {govWatchers.filter(gw => gw.active).length === 0
                      ? 'Create a Gov Watcher from the sidebar to start monitoring government feeds.'
                      : govPolling ? 'Fetching government feeds...' : 'Click "Refresh" to fetch the latest updates.'}
                  </div>
                </div>
              ) : (
                displayGovArticles.map((article, i) => (
                  <GovArticleCard key={article.url || i} article={article} />
                ))
              )}

              {govLastPoll && (
                <div style={{ marginTop: 16, fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
                  Last fetched: {govLastPoll.toLocaleTimeString()} &middot; {displayGovArticles.length} items
                </div>
              )}
            </>
          )}

          {activeTab === 'sources' && (
            <SourcesPanel />
          )}
        </div>

        {/* Status bar */}
        <div className="status-bar">
          <div className="status-bar__left">
            <span>
              <span className={`status-dot ${isPolling || govPolling ? 'status-dot--polling' : error || govError ? 'status-dot--error' : 'status-dot--active'}`} />
              {isPolling || govPolling ? 'Polling...' : error || govError ? 'Error' : 'Ready'}
            </span>
            {lastPoll && <span>Last poll: {lastPoll.toLocaleTimeString()}</span>}
          </div>
          <div className="status-bar__right">
            <span>{watchers.filter(w => w.active).length}/{watchers.length} watchers</span>
            {govWatchers.length > 0 && (
              <span>{govWatchers.filter(gw => gw.active).length}/{govWatchers.length} gov</span>
            )}
            <span>{articles.length} articles</span>
          </div>
        </div>
      </div>

      {/* Watcher Form Modal */}
      {showWatcherForm && (
        <WatcherFormModal
          watcher={editingWatcher}
          onSave={(data) => {
            if (editingWatcher) {
              updateWatcher(editingWatcher.id, data);
            } else {
              createWatcher(data);
            }
          }}
          onClose={() => { setShowWatcherForm(false); setEditingWatcher(null); }}
        />
      )}

      {/* Gov Watcher Form Modal */}
      {showGovWatcherForm && (
        <GovWatcherFormModal
          existingFeedIds={govWatchers.map(gw => gw.feedId)}
          onCreate={createGovWatcher}
          onClose={() => setShowGovWatcherForm(false)}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          settings={settings}
          onSave={(s) => { setSettings(s); setShowSettings(false); }}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

// ─── Article Card ────────────────────────────────────────────────────
function ArticleCard({ article, excluded }) {
  const sourceType = article.sourceType || 'unknown';
  const confidence = article.geoConfidence || 'unknown';

  return (
    <div className="article-card">
      <div className="article-card__header">
        <div className="article-card__title">
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            {article.title}
          </a>
        </div>
      </div>
      {article.snippet && (
        <div className="article-card__snippet">{article.snippet}</div>
      )}
      <div className="article-card__meta">
        <span className="badge badge--source">{sourceType}</span>
        <span className={`badge ${confidence === 'high' ? 'badge--geo' : 'badge--geo-low'}`}>
          {confidence} geo
        </span>
        {article.entityMatch && <span className="badge badge--entity">entity match</span>}
        {excluded && <span className="badge" style={{ background: 'var(--danger-dim)', color: 'var(--danger)' }}>excluded</span>}
        <span>{article.source}</span>
        <span>{article.date ? new Date(article.date).toLocaleDateString() : ''}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{article.provider}</span>
      </div>
      {article.matchedLocations && article.matchedLocations.length > 0 && (
        <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}>
          Matched: {article.matchedLocations.join(', ')}
        </div>
      )}
    </div>
  );
}

// ─── Gov Article Card ─────────────────────────────────────────────────
function GovArticleCard({ article }) {
  return (
    <div className="article-card gov-article-card">
      <div className="article-card__header">
        <div className="article-card__title">
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            {article.title}
          </a>
        </div>
      </div>
      {article.snippet && (
        <div className="article-card__snippet">{article.snippet}</div>
      )}
      <div className="article-card__meta">
        <span className="badge badge--gov">{article.govLevel || 'gov'}</span>
        {article.govCategory && (
          <span className="badge badge--gov-category">{article.govCategory}</span>
        )}
        <span>{article.source}</span>
        <span>{article.date ? new Date(article.date).toLocaleDateString() : ''}</span>
      </div>
    </div>
  );
}

// ─── Gov Watcher Form Modal ─────────────────────────────────────────
function GovWatcherFormModal({ existingFeedIds, onCreate, onClose }) {
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState('');

  const searchLower = search.toLowerCase();

  // Build the browsable feed list
  const federalFiltered = FEDERAL_FEEDS.filter(f =>
    !existingFeedIds.includes(f.id) &&
    (searchLower === '' || f.name.toLowerCase().includes(searchLower) || f.category.toLowerCase().includes(searchLower))
  );

  const stateFeeds = selectedState && STATE_FEEDS[selectedState]
    ? STATE_FEEDS[selectedState].filter(f =>
        !existingFeedIds.includes(f.id) &&
        (searchLower === '' || f.name.toLowerCase().includes(searchLower) || f.category.toLowerCase().includes(searchLower))
      )
    : [];

  const localFeeds = selectedState && LOCAL_FEEDS[selectedState]
    ? LOCAL_FEEDS[selectedState].filter(f =>
        !existingFeedIds.includes(f.id) &&
        (searchLower === '' || f.name.toLowerCase().includes(searchLower) || f.category.toLowerCase().includes(searchLower))
      )
    : [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <div className="modal__title">Add Gov Watcher</div>
          <button className="modal__close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal__body">
          <div className="form-group">
            <input
              className="form-input"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search agencies..."
              autoFocus
            />
          </div>

          {/* Federal feeds */}
          <div className="gov-picker__section">
            <div className="gov-picker__section-title">Federal Agencies</div>
            {federalFiltered.length === 0 ? (
              <div className="gov-picker__empty">
                {search ? 'No matches' : 'All federal agencies added'}
              </div>
            ) : (
              federalFiltered.map(feed => (
                <div key={feed.id} className="gov-picker__item" onClick={() => onCreate(feed, 'federal')}>
                  <div className="gov-picker__item-name">{feed.name}</div>
                  <div className="gov-picker__item-meta">{feed.category}</div>
                </div>
              ))
            )}
          </div>

          {/* State feed picker */}
          <div className="gov-picker__section">
            <div className="gov-picker__section-title">State Government</div>
            <div className="form-group" style={{ marginBottom: 8 }}>
              <select
                className="form-select"
                value={selectedState}
                onChange={e => setSelectedState(e.target.value)}
              >
                <option value="">Select a state...</option>
                {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {selectedState && stateFeeds.length === 0 ? (
              <div className="gov-picker__empty">
                {search ? 'No matches' : `All ${selectedState} agencies added`}
              </div>
            ) : (
              stateFeeds.map(feed => (
                <div key={feed.id} className="gov-picker__item" onClick={() => onCreate(feed, 'state')}>
                  <div className="gov-picker__item-name">{feed.name}</div>
                  <div className="gov-picker__item-meta">{feed.category}</div>
                </div>
              ))
            )}
          </div>

          {/* Local government feeds */}
          {selectedState && LOCAL_FEEDS[selectedState] && (
            <div className="gov-picker__section">
              <div className="gov-picker__section-title">Local Government — {selectedState}</div>
              {localFeeds.length === 0 ? (
                <div className="gov-picker__empty">
                  {search ? 'No matches' : `All ${selectedState} local agencies added`}
                </div>
              ) : (
                localFeeds.map(feed => (
                  <div key={feed.id} className="gov-picker__item" onClick={() => onCreate(feed, 'local')}>
                    <div className="gov-picker__item-name">{feed.name}</div>
                    <div className="gov-picker__item-meta">{feed.category}</div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        <div className="modal__footer">
          <button type="button" className="btn" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
}

// ─── Watcher Form Modal ──────────────────────────────────────────────
function WatcherFormModal({ watcher, onSave, onClose }) {
  const [form, setForm] = useState({
    name: watcher?.name || '',
    keywords: (watcher?.keywords || []).join(', '),
    excludeKeywords: (watcher?.excludeKeywords || []).join(', '),
    trackedEntities: (watcher?.trackedEntities || []).join(', '),
    geoState: watcher?.geoState || 'Idaho',
    geoRegion: watcher?.geoRegion || '',
    geoCustom: watcher?.geoCustom || '',
    dateMode: watcher?.dateMode || 'rolling',
    rollingDays: watcher?.rollingDays || 7,
    dateFrom: watcher?.dateFrom || '',
    dateTo: watcher?.dateTo || '',
    alertMode: watcher?.alertMode || 'instant',
    channels: watcher?.channels || { push: true, email: false, slack: false },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      keywords: form.keywords.split(',').map(s => s.trim()).filter(Boolean),
      excludeKeywords: form.excludeKeywords.split(',').map(s => s.trim()).filter(Boolean),
      trackedEntities: form.trackedEntities.split(',').map(s => s.trim()).filter(Boolean),
      rollingDays: Number(form.rollingDays),
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <div className="modal__title">{watcher ? 'Edit Watcher' : 'New Watcher'}</div>
          <button className="modal__close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal__body">
            <div className="form-group">
              <label className="form-label">Name</label>
              <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g., Idaho Immigration" required />
            </div>

            <div className="form-group">
              <label className="form-label">Keywords (comma-separated)</label>
              <input className="form-input" value={form.keywords} onChange={e => setForm({ ...form, keywords: e.target.value })} placeholder="e.g., immigration, detention, ICE" />
              <div className="form-hint">Articles must match at least one keyword</div>
            </div>

            <div className="form-group">
              <label className="form-label">Exclusion Keywords (comma-separated)</label>
              <input className="form-input" value={form.excludeKeywords} onChange={e => setForm({ ...form, excludeKeywords: e.target.value })} placeholder="e.g., opinion, editorial" />
              <div className="form-hint" style={{ color: 'var(--danger)' }}>Articles matching these will be filtered out</div>
            </div>

            <div className="form-group">
              <label className="form-label">Tracked Entities (comma-separated)</label>
              <input className="form-input" value={form.trackedEntities} onChange={e => setForm({ ...form, trackedEntities: e.target.value })} placeholder="e.g., Judge Dale, Canyon County Sheriff" />
              <div className="form-hint">Named people, orgs, or facilities to track</div>
            </div>

            <div className="form-group">
              <label className="form-label">State</label>
              <select className="form-select" value={form.geoState} onChange={e => setForm({ ...form, geoState: e.target.value, geoRegion: '' })}>
                <option value="">Any state</option>
                {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {form.geoState === 'Idaho' && (
              <div className="form-group">
                <label className="form-label">Region</label>
                <select className="form-select" value={form.geoRegion} onChange={e => setForm({ ...form, geoRegion: e.target.value })}>
                  <option value="">All regions</option>
                  {Object.keys(IDAHO_REGIONS).map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Custom Geo Filter</label>
              <input className="form-input" value={form.geoCustom} onChange={e => setForm({ ...form, geoCustom: e.target.value })} placeholder="e.g., Canyon County, Nampa" />
              <div className="form-hint">Additional location terms (comma-separated)</div>
            </div>

            <div className="form-group">
              <label className="form-label">Date Mode</label>
              <select className="form-select" value={form.dateMode} onChange={e => setForm({ ...form, dateMode: e.target.value })}>
                <option value="rolling">Rolling window</option>
                <option value="fixed">Fixed range</option>
              </select>
            </div>

            {form.dateMode === 'rolling' ? (
              <div className="form-group">
                <label className="form-label">Rolling Window</label>
                <select className="form-select" value={form.rollingDays} onChange={e => setForm({ ...form, rollingDays: e.target.value })}>
                  <option value={1}>Last 24 hours</option>
                  <option value={3}>Last 3 days</option>
                  <option value={7}>Last 7 days</option>
                  <option value={30}>Last 30 days</option>
                </select>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 12 }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">From</label>
                  <input className="form-input" type="date" value={form.dateFrom} onChange={e => setForm({ ...form, dateFrom: e.target.value })} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">To</label>
                  <input className="form-input" type="date" value={form.dateTo} onChange={e => setForm({ ...form, dateTo: e.target.value })} />
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Alert Mode</label>
              <select className="form-select" value={form.alertMode} onChange={e => setForm({ ...form, alertMode: e.target.value })}>
                <option value="instant">Instant</option>
                <option value="digest">Daily digest</option>
                <option value="breaking">Breaking only</option>
              </select>
            </div>

            <ChannelToggle
              channels={form.channels}
              onChange={(channels) => setForm({ ...form, channels })}
            />
          </div>

          <div className="modal__footer">
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn--primary">{watcher ? 'Save Changes' : 'Create Watcher'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Sources Panel ───────────────────────────────────────────────────
function SourcesPanel() {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(prev => prev === section ? null : section);
  };

  // Group SOURCE_MAP entries by type
  const sourcesByType = {};
  for (const [name, type] of Object.entries(SOURCE_MAP)) {
    if (!sourcesByType[type]) sourcesByType[type] = [];
    sourcesByType[type].push(name);
  }

  const sourceTypeLabels = {
    wire: 'Wire Services',
    national: 'National Outlets',
    local: 'Idaho Local News',
    broadcast: 'Idaho Broadcast',
    regional: 'Pacific Northwest Regional',
    trade: 'Trade / Specialty',
    opinion: 'Opinion / Analysis',
  };

  // Collect state names that have feeds
  const statesWithFeeds = Object.keys(STATE_FEEDS).sort();
  const statesWithLocalFeeds = Object.keys(LOCAL_FEEDS).sort();

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Sources</h3>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
          All data sources that J Watch pulls from. News articles come from multiple API providers,
          and government updates come from official .gov RSS feeds.
        </p>
      </div>

      {/* News API Providers */}
      <div className="sources-section">
        <div className="sources-section__header" onClick={() => toggleSection('news-apis')}>
          <div className="sources-section__title">News API Providers</div>
          <div className="sources-section__count">
            {Object.keys(PROVIDERS).length} providers
          </div>
          <span className="sources-section__chevron">{expandedSection === 'news-apis' ? '\u25B2' : '\u25BC'}</span>
        </div>
        {expandedSection === 'news-apis' && (
          <div className="sources-section__body">
            <p className="sources-section__desc">
              J Watch queries multiple news APIs in rotation to maximize coverage while staying within free-tier rate limits.
            </p>
            {Object.entries(PROVIDERS).map(([key, provider]) => (
              <div key={key} className="source-item">
                <div className="source-item__name">{provider.name}</div>
                <div className="source-item__meta">
                  <span className="badge badge--source">{key}</span>
                  <span>Daily limit: {provider.dailyLimit === Infinity ? 'Unlimited' : provider.dailyLimit}</span>
                  {provider.envKey && <span className="source-item__env">{provider.envKey}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Federal Government Feeds */}
      <div className="sources-section">
        <div className="sources-section__header" onClick={() => toggleSection('federal')}>
          <div className="sources-section__title sources-section__title--gov">Federal Government</div>
          <div className="sources-section__count">
            {FEDERAL_FEEDS.length} feeds
          </div>
          <span className="sources-section__chevron">{expandedSection === 'federal' ? '\u25B2' : '\u25BC'}</span>
        </div>
        {expandedSection === 'federal' && (
          <div className="sources-section__body">
            <p className="sources-section__desc">
              Official RSS/Atom feeds from federal agencies and departments. All sources are .gov or .mil domains.
            </p>
            {FEDERAL_FEEDS.map(feed => (
              <div key={feed.id} className="source-item source-item--gov">
                <div className="source-item__name">{feed.name}</div>
                <div className="source-item__meta">
                  <span className="badge badge--gov-category">{feed.category}</span>
                  <a href={feed.url} target="_blank" rel="noopener noreferrer" className="source-item__link">
                    {new URL(feed.url).hostname}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* State Government Feeds */}
      <div className="sources-section">
        <div className="sources-section__header" onClick={() => toggleSection('state')}>
          <div className="sources-section__title sources-section__title--gov">State Government</div>
          <div className="sources-section__count">
            {statesWithFeeds.length} states &middot; {statesWithFeeds.reduce((sum, s) => sum + STATE_FEEDS[s].length, 0)} feeds
          </div>
          <span className="sources-section__chevron">{expandedSection === 'state' ? '\u25B2' : '\u25BC'}</span>
        </div>
        {expandedSection === 'state' && (
          <div className="sources-section__body">
            <p className="sources-section__desc">
              State-level government RSS feeds organized by state.
            </p>
            {statesWithFeeds.map(state => (
              <div key={state} className="sources-state-group">
                <div className="sources-state-group__name">{state}</div>
                {STATE_FEEDS[state].map(feed => (
                  <div key={feed.id} className="source-item source-item--gov source-item--nested">
                    <div className="source-item__name">{feed.name}</div>
                    <div className="source-item__meta">
                      <span className="badge badge--gov-category">{feed.category}</span>
                      <a href={feed.url} target="_blank" rel="noopener noreferrer" className="source-item__link">
                        {new URL(feed.url).hostname}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Local Government Feeds */}
      <div className="sources-section">
        <div className="sources-section__header" onClick={() => toggleSection('local')}>
          <div className="sources-section__title sources-section__title--gov">Local Government</div>
          <div className="sources-section__count">
            {statesWithLocalFeeds.length} states &middot; {statesWithLocalFeeds.reduce((sum, s) => sum + LOCAL_FEEDS[s].length, 0)} feeds
          </div>
          <span className="sources-section__chevron">{expandedSection === 'local' ? '\u25B2' : '\u25BC'}</span>
        </div>
        {expandedSection === 'local' && (
          <div className="sources-section__body">
            <p className="sources-section__desc">
              City and county level government RSS feeds.
            </p>
            {statesWithLocalFeeds.map(state => (
              <div key={state} className="sources-state-group">
                <div className="sources-state-group__name">{state}</div>
                {LOCAL_FEEDS[state].map(feed => (
                  <div key={feed.id} className="source-item source-item--gov source-item--nested">
                    <div className="source-item__name">{feed.name}</div>
                    <div className="source-item__meta">
                      <span className="badge badge--gov-category">{feed.category}</span>
                      <a href={feed.url} target="_blank" rel="noopener noreferrer" className="source-item__link">
                        {new URL(feed.url).hostname}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* News Source Classification */}
      <div className="sources-section">
        <div className="sources-section__header" onClick={() => toggleSection('classification')}>
          <div className="sources-section__title">News Source Classification</div>
          <div className="sources-section__count">
            {Object.keys(SOURCE_MAP).length} outlets
          </div>
          <span className="sources-section__chevron">{expandedSection === 'classification' ? '\u25B2' : '\u25BC'}</span>
        </div>
        {expandedSection === 'classification' && (
          <div className="sources-section__body">
            <p className="sources-section__desc">
              How J Watch classifies news outlets for geo-scoring and source-type tagging.
            </p>
            {Object.entries(sourceTypeLabels).map(([type, label]) => {
              const sources = sourcesByType[type];
              if (!sources || sources.length === 0) return null;
              return (
                <div key={type} className="sources-type-group">
                  <div className="sources-type-group__label">{label}</div>
                  <div className="sources-type-group__list">
                    {sources.map(name => (
                      <span key={name} className="sources-type-group__tag">{name}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

// ─── Settings Modal ──────────────────────────────────────────────────
function SettingsModal({ settings, onSave, onClose }) {
  const [form, setForm] = useState({ ...settings });
  const pushPermission = getPushPermission();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      pollingInterval: Number(form.pollingInterval),
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <div className="modal__title">Settings</div>
          <button className="modal__close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal__body">
            <div className="form-group">
              <label className="form-label">Polling Interval (minutes)</label>
              <select className="form-select" value={form.pollingInterval} onChange={e => setForm({ ...form, pollingInterval: e.target.value })}>
                <option value={1}>1 minute</option>
                <option value={5}>5 minutes</option>
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>60 minutes</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" checked={form.turboMode} onChange={e => setForm({ ...form, turboMode: e.target.checked })} />
                Turbo Mode (1 provider per poll, saves quota)
              </label>
            </div>

            <div className="form-group">
              <label className="form-label">Push Notifications</label>
              {pushPermission === 'granted' ? (
                <div style={{ fontSize: 13, color: 'var(--success)' }}>Enabled</div>
              ) : pushPermission === 'denied' ? (
                <div style={{ fontSize: 13, color: 'var(--danger)' }}>Blocked — enable in browser settings</div>
              ) : (
                <button type="button" className="btn btn--sm" onClick={requestPushPermission}>Enable Push Notifications</button>
              )}
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '16px 0' }} />

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" checked={form.quietHoursEnabled} onChange={e => setForm({ ...form, quietHoursEnabled: e.target.checked })} />
                Quiet Hours
              </label>
            </div>

            {form.quietHoursEnabled && (
              <div style={{ display: 'flex', gap: 12 }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">From</label>
                  <input className="form-input" type="time" value={form.quietFrom} onChange={e => setForm({ ...form, quietFrom: e.target.value })} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">To</label>
                  <input className="form-input" type="time" value={form.quietTo} onChange={e => setForm({ ...form, quietTo: e.target.value })} />
                </div>
              </div>
            )}

            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '16px 0' }} />

            <div className="form-group">
              <label className="form-label">Digest Time</label>
              <input className="form-input" type="time" value={form.digestTime} onChange={e => setForm({ ...form, digestTime: e.target.value })} />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" value={form.emailAddress} onChange={e => setForm({ ...form, emailAddress: e.target.value })} placeholder="your@email.com" />
            </div>

            <div className="form-group">
              <label className="form-label">Slack Webhook URL</label>
              <input className="form-input" type="url" value={form.slackWebhook} onChange={e => setForm({ ...form, slackWebhook: e.target.value })} placeholder="https://hooks.slack.com/services/..." />
            </div>
          </div>

          <div className="modal__footer">
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn--primary">Save Settings</button>
          </div>
        </form>
      </div>
    </div>
  );
}
