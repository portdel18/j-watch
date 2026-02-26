import React, { useState, useEffect, useCallback } from 'react';
import ChannelToggle from './components/ChannelToggle';
import { usePolling } from './hooks/usePolling';
import { getQuotaStatus } from './services/newsApi';
import { requestPushPermission, getPushPermission, dispatchNotification } from './services/notifications';
import { US_STATES, IDAHO_REGIONS } from './data/geography';
import { fetchGovArticles } from './services/govWatch';

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
  // Government Watch
  govWatchEnabled: false,
  govFederal: true,
  govState: '',
  govFilter: '',
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

  // Polling
  const { articles, excluded, isPolling, lastPoll, error, pollNow } = usePolling(watchers, settings);

  // Government Watch state
  const [govArticles, setGovArticles] = useState([]);
  const [govPolling, setGovPolling] = useState(false);
  const [govLastPoll, setGovLastPoll] = useState(null);
  const [govError, setGovError] = useState(null);

  const pollGov = useCallback(async () => {
    if (!settings.govWatchEnabled) return;
    setGovPolling(true);
    setGovError(null);
    try {
      const results = await fetchGovArticles({
        enabled: true,
        federal: settings.govFederal,
        govState: settings.govState,
        govFilter: settings.govFilter,
      });
      setGovArticles(results);
      setGovLastPoll(new Date());
    } catch (err) {
      console.error('[GovWatch] Poll error:', err);
      setGovError(err.message);
    } finally {
      setGovPolling(false);
    }
  }, [settings.govWatchEnabled, settings.govFederal, settings.govState, settings.govFilter]);

  // Auto-poll Gov Watch on settings change + interval
  useEffect(() => {
    if (!settings.govWatchEnabled) return;
    pollGov();
    const interval = setInterval(pollGov, (settings.pollingInterval || 5) * 60 * 1000);
    return () => clearInterval(interval);
  }, [settings.govWatchEnabled, pollGov, settings.pollingInterval]);

  // Persist to localStorage
  useEffect(() => { saveJSON('jwatch_watchers', watchers); }, [watchers]);
  useEffect(() => { saveJSON('jwatch_notifications', notifications); }, [notifications]);
  useEffect(() => { saveJSON('jwatch_settings', settings); }, [settings]);

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
              onClick={() => setSelectedWatcher(w.id === selectedWatcher ? null : w.id)}
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
          {settings.govWatchEnabled && (
            <button className={`tab ${activeTab === 'gov' ? 'active' : ''}`} onClick={() => setActiveTab('gov')}>
              Gov Watch
              {govArticles.length > 0 && <span className="tab__badge tab__badge--gov">{govArticles.length}</span>}
            </button>
          )}
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
                  Government Watch
                  {settings.govFilter && (
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 400, marginLeft: 8 }}>
                      filtered: {settings.govFilter}
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

              {govArticles.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state__icon">&#127963;</div>
                  <div className="empty-state__title">No government updates</div>
                  <div className="empty-state__text">
                    {govPolling ? 'Fetching government feeds...' : 'Click "Refresh" to fetch the latest government press releases and announcements.'}
                  </div>
                </div>
              ) : (
                govArticles.map((article, i) => (
                  <GovArticleCard key={article.url || i} article={article} />
                ))
              )}

              {govLastPoll && (
                <div style={{ marginTop: 16, fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
                  Last fetched: {govLastPoll.toLocaleTimeString()} &middot; {govArticles.length} items
                </div>
              )}
            </>
          )}
        </div>

        {/* Status bar */}
        <div className="status-bar">
          <div className="status-bar__left">
            <span>
              <span className={`status-dot ${isPolling ? 'status-dot--polling' : error ? 'status-dot--error' : 'status-dot--active'}`} />
              {isPolling ? 'Polling...' : error ? 'Error' : 'Ready'}
            </span>
            {lastPoll && <span>Last poll: {lastPoll.toLocaleTimeString()}</span>}
          </div>
          <div className="status-bar__right">
            <span>{watchers.filter(w => w.active).length}/{watchers.length} watchers active</span>
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

            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '16px 0' }} />

            <div className="gov-settings">
              <div className="gov-settings__header">Government Watch</div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" checked={form.govWatchEnabled || false} onChange={e => setForm({ ...form, govWatchEnabled: e.target.checked })} />
                  Enable Government Watch
                </label>
                <div className="form-hint">Pull press releases and announcements from official government sources</div>
              </div>

              {form.govWatchEnabled && (
                <>
                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input type="checkbox" checked={form.govFederal !== false} onChange={e => setForm({ ...form, govFederal: e.target.checked })} />
                      Federal (White House, Congress, Federal Register, Agencies)
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="form-label">State</label>
                    <select className="form-select" value={form.govState || ''} onChange={e => setForm({ ...form, govState: e.target.value })}>
                      <option value="">None</option>
                      {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <div className="form-hint">Select a state to include governor and state agency feeds</div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Filter Keywords (optional)</label>
                    <input className="form-input" value={form.govFilter || ''} onChange={e => setForm({ ...form, govFilter: e.target.value })} placeholder="e.g. environment, housing, immigration" />
                    <div className="form-hint">Comma-separated. Narrows results after fetch. Leave blank to see everything.</div>
                  </div>
                </>
              )}
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
