// Polling hook for scheduled article fetching — supports per-watcher intervals
import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchArticles } from '../services/newsApi';
import { matchArticles, buildSearchQuery } from '../services/matchingEngine';

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

const TICK_INTERVAL = 60 * 1000; // check every 60 seconds which watchers are due

export function usePolling(watchers, settings = {}) {
  const [articles, setArticles] = useState(() => loadJSON('jwatch_articles', []));
  const [excluded, setExcluded] = useState(() => loadJSON('jwatch_excluded', []));
  const [isPolling, setIsPolling] = useState(false);
  const [lastPoll, setLastPoll] = useState(() => {
    const saved = localStorage.getItem('jwatch_lastPoll');
    return saved ? new Date(saved) : null;
  });
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);
  const isMountedRef = useRef(true);
  const isPollingRef = useRef(false); // guard against concurrent polls
  // Track when each watcher was last polled: { [watcherId]: timestamp }
  const lastPollPerWatcher = useRef(
    loadJSON('jwatch_lastPollPerWatcher', {})
  );

  // Poll only the watchers that are "due" based on their individual pollingInterval
  const pollDue = useCallback(async () => {
    if (isPollingRef.current) return; // already polling, skip this tick

    const now = Date.now();
    const activeWatchers = watchers.filter(w => w.active);
    if (activeWatchers.length === 0) return;

    // Figure out which watchers are due
    const dueWatchers = activeWatchers.filter(w => {
      const interval = (w.pollingInterval || settings.pollingInterval || 5) * 60 * 1000;
      const lastTime = lastPollPerWatcher.current[w.id] || 0;
      return now - lastTime >= interval;
    });

    if (dueWatchers.length === 0) return;

    isPollingRef.current = true;
    setIsPolling(true);
    setError(null);

    try {
      const allMatched = [];
      const allExcluded = [];

      for (const watcher of dueWatchers) {
        const query = buildSearchQuery(watcher);
        if (!query) continue;

        // Resolve date range
        const options = { turboMode: settings.turboMode };
        if (watcher.dateMode === 'fixed') {
          if (watcher.dateFrom) options.from = watcher.dateFrom;
          if (watcher.dateTo) options.to = watcher.dateTo;
        } else {
          const days = watcher.rollingDays || 7;
          const from = new Date();
          from.setDate(from.getDate() - days);
          options.from = from.toISOString().split('T')[0];
        }

        const raw = await fetchArticles(query, options);
        const { matched, excluded: exc } = matchArticles(raw, watcher);

        // Tag matched articles with watcher info
        const tagged = matched.map(a => ({
          ...a,
          matchedWatcherId: watcher.id,
          matchedWatcherName: watcher.name,
        }));

        allMatched.push(...tagged);
        allExcluded.push(...exc);

        // Mark this watcher as polled
        lastPollPerWatcher.current[watcher.id] = now;
      }

      // Persist per-watcher timestamps
      localStorage.setItem('jwatch_lastPollPerWatcher', JSON.stringify(lastPollPerWatcher.current));

      if (isMountedRef.current) {
        // Merge new results with existing articles (keep articles from watchers not polled this tick)
        setArticles(prev => {
          const polledIds = new Set(dueWatchers.map(w => w.id));
          // Keep articles from watchers that were NOT polled this tick
          const kept = prev.filter(a => !polledIds.has(a.matchedWatcherId));
          const combined = [...kept, ...allMatched];

          // Deduplicate by URL, keeping highest geo score
          const seen = new Map();
          for (const article of combined) {
            const key = article.url || article.title;
            const existing = seen.get(key);
            if (!existing || (article.geoScore || 0) > (existing.geoScore || 0)) {
              seen.set(key, article);
            }
          }
          return Array.from(seen.values());
        });
        setExcluded(allExcluded);
        setLastPoll(new Date());
      }
    } catch (err) {
      console.error('[Polling] Error:', err);
      if (isMountedRef.current) {
        setError(err.message);
      }
    } finally {
      isPollingRef.current = false;
      if (isMountedRef.current) {
        setIsPolling(false);
      }
    }
  }, [watchers, settings.turboMode, settings.pollingInterval]);

  // Poll ALL active watchers immediately (used for manual "poll now" button)
  const pollNow = useCallback(async () => {
    // Reset all timestamps so every watcher is "due"
    const activeWatchers = watchers.filter(w => w.active);
    for (const w of activeWatchers) {
      lastPollPerWatcher.current[w.id] = 0;
    }
    await pollDue();
  }, [watchers, pollDue]);

  // Persist articles to localStorage
  useEffect(() => { localStorage.setItem('jwatch_articles', JSON.stringify(articles)); }, [articles]);
  useEffect(() => { localStorage.setItem('jwatch_excluded', JSON.stringify(excluded)); }, [excluded]);
  useEffect(() => { if (lastPoll) localStorage.setItem('jwatch_lastPoll', lastPoll.toISOString()); }, [lastPoll]);

  // Start/stop polling
  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const activeWatchers = watchers.filter(w => w.active);
    if (activeWatchers.length > 0) {
      // Run immediately on mount, then tick every minute to check which watchers are due
      pollDue();
      intervalRef.current = setInterval(pollDue, TICK_INTERVAL);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [pollDue, watchers]);

  return {
    articles,
    excluded,
    isPolling,
    lastPoll,
    error,
    pollNow,
  };
}
