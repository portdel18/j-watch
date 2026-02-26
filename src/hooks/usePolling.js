// Polling hook for scheduled article fetching
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

  const pollInterval = (settings.pollingInterval || 5) * 60 * 1000; // default 5 min

  const poll = useCallback(async () => {
    const activeWatchers = watchers.filter(w => w.active);
    if (activeWatchers.length === 0) return;

    setIsPolling(true);
    setError(null);

    try {
      const allMatched = [];
      const allExcluded = [];

      for (const watcher of activeWatchers) {
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
      }

      if (isMountedRef.current) {
        // Deduplicate by URL, keeping highest geo score
        const seen = new Map();
        for (const article of allMatched) {
          const key = article.url || article.title;
          const existing = seen.get(key);
          if (!existing || (article.geoScore || 0) > (existing.geoScore || 0)) {
            seen.set(key, article);
          }
        }
        setArticles(Array.from(seen.values()));
        setExcluded(allExcluded);
        setLastPoll(new Date());
      }
    } catch (err) {
      console.error('[Polling] Error:', err);
      if (isMountedRef.current) {
        setError(err.message);
      }
    } finally {
      if (isMountedRef.current) {
        setIsPolling(false);
      }
    }
  }, [watchers, settings.turboMode]); // eslint-disable-line react-hooks/exhaustive-deps

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
      intervalRef.current = setInterval(poll, pollInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [poll, pollInterval, watchers]);

  return {
    articles,
    excluded,
    isPolling,
    lastPoll,
    error,
    pollNow: poll,
  };
}
