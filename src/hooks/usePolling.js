// Polling hook for scheduled article fetching — supports per-watcher intervals
import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchArticles } from '../services/newsApi';
import { matchArticles, buildSearchQuery } from '../services/matchingEngine';
import { mergeArticles, mergeExcluded, articleKey } from '../services/articleStore';

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
  // Keys of articles that arrived in the most recent poll, so the feed can
  // flag what is actually new instead of guessing from list length.
  const [newKeys, setNewKeys] = useState(() => new Set());
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);
  const isMountedRef = useRef(true);
  const isPollingRef = useRef(false); // guard against concurrent polls
  // Mirrors `articles` so a poll can merge against the current store and know
  // which keys are new right away — a setState updater runs at render time,
  // too late to tell us anything during the poll itself.
  const articlesRef = useRef(articles);
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
        allExcluded.push(...exc.map(a => ({ ...a, matchedWatcherId: watcher.id })));

        // Mark this watcher as polled
        lastPollPerWatcher.current[watcher.id] = now;
      }

      // Persist per-watcher timestamps
      localStorage.setItem('jwatch_lastPollPerWatcher', JSON.stringify(lastPollPerWatcher.current));

      if (isMountedRef.current) {
        // Accumulate: a poll ADDS to the feed. Articles already on screen stay
        // there even when a provider doesn't return them again — providers are
        // rotated and their result sets vary from call to call, so replacing
        // the list would make the feed shrink and reshuffle at random.
        const knownWatcherIds = new Set(watchers.map(w => w.id));

        const { articles: nextArticles, newKeys: freshKeys } = mergeArticles(
          articlesRef.current,
          allMatched,
          { now, knownWatcherIds }
        );
        articlesRef.current = nextArticles;

        setArticles(nextArticles);
        setExcluded(prev => mergeExcluded(prev, allExcluded, { now, knownWatcherIds }));
        setNewKeys(new Set(freshKeys));
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

  // Remove a single article from the feed (it stays gone until re-fetched)
  const dismissArticle = useCallback((article) => {
    const key = articleKey(article);
    setArticles(prev => {
      const next = prev.filter(a => articleKey(a) !== key);
      articlesRef.current = next;
      return next;
    });
  }, []);

  // Clear the whole feed — next poll starts from an empty archive
  const clearArticles = useCallback(() => {
    articlesRef.current = [];
    setArticles([]);
    setExcluded([]);
    setNewKeys(new Set());
  }, []);

  // Persist articles to localStorage
  useEffect(() => {
    articlesRef.current = articles;
    localStorage.setItem('jwatch_articles', JSON.stringify(articles));
  }, [articles]);
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
    newKeys,
    error,
    pollNow,
    dismissArticle,
    clearArticles,
  };
}
