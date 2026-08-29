// Article store helpers — stable identity, accumulating merges, retention.
//
// The feed is a rolling archive, not a snapshot of the last API response.
// Every poll ADDS to what is already there; nothing disappears just because
// a provider happened not to return it this time.

// Query params that identify a referrer, not an article.
const TRACKING_PARAMS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'utm_id', 'utm_name', 'fbclid', 'gclid', 'mc_cid', 'mc_eid', 'ref', 'ref_src',
];

// Stable identity for an article across polls and across providers.
// The same story fetched from NewsAPI and GNews should collapse to one key.
export function articleKey(article) {
  if (!article) return '';
  const url = article.url || '';
  if (url) {
    try {
      const parsed = new URL(url);
      parsed.hash = '';
      for (const param of TRACKING_PARAMS) parsed.searchParams.delete(param);
      const host = parsed.host.replace(/^www\./, '').toLowerCase();
      const path = parsed.pathname.replace(/\/+$/, '');
      return `${host}${path}${parsed.search}`;
    } catch {
      return url.trim().toLowerCase();
    }
  }
  return `${(article.title || '').trim().toLowerCase()}::${(article.source || '').trim().toLowerCase()}`;
}

// Newest first. Falls back to first-seen time when an article has no date.
function byDateDesc(a, b) {
  const aTime = new Date(a.date || a.firstSeenAt || 0).getTime();
  const bTime = new Date(b.date || b.firstSeenAt || 0).getTime();
  return bTime - aTime;
}

// How many articles to keep, and how long. Prevents localStorage from growing
// without bound while keeping far more history than a single poll returns.
export const MAX_STORED_ARTICLES = 500;
export const MAX_STORED_EXCLUDED = 200;
export const RETENTION_DAYS = 30;

function isExpired(article, now) {
  const seen = new Date(article.firstSeenAt || article.date || now).getTime();
  if (Number.isNaN(seen)) return false;
  return now - seen > RETENTION_DAYS * 24 * 60 * 60 * 1000;
}

/**
 * Merge freshly fetched articles into the existing store.
 *
 * Existing articles are never dropped because a poll didn't return them —
 * they are only dropped when they age out, when the store is over capacity,
 * or when their watcher no longer exists.
 *
 * @returns {{ articles: Array, newKeys: string[] }} merged store (newest first)
 *   and the keys of articles seen for the very first time in this batch.
 */
export function mergeArticles(previous, incoming, options = {}) {
  const now = options.now || Date.now();
  const nowIso = new Date(now).toISOString();
  const knownWatcherIds = options.knownWatcherIds || null;
  const limit = options.limit || MAX_STORED_ARTICLES;

  const merged = new Map();

  for (const article of previous || []) {
    if (knownWatcherIds && article.matchedWatcherId && !knownWatcherIds.has(article.matchedWatcherId)) {
      continue; // watcher was deleted — its articles go with it
    }
    if (isExpired(article, now)) continue;
    const key = articleKey(article);
    if (!key) continue;
    merged.set(key, article.firstSeenAt ? article : { ...article, firstSeenAt: nowIso });
  }

  const newKeys = [];

  for (const article of incoming || []) {
    const key = articleKey(article);
    if (!key) continue;
    const existing = merged.get(key);

    if (!existing) {
      merged.set(key, { ...article, firstSeenAt: nowIso, lastSeenAt: nowIso });
      newKeys.push(key);
      continue;
    }

    // Already known: refresh the payload but keep when we first saw it, and
    // keep the strongest geo score seen for this story.
    merged.set(key, {
      ...existing,
      ...article,
      firstSeenAt: existing.firstSeenAt,
      lastSeenAt: nowIso,
      geoScore: Math.max(article.geoScore || 0, existing.geoScore || 0),
      geoConfidence: (article.geoScore || 0) >= (existing.geoScore || 0)
        ? article.geoConfidence
        : existing.geoConfidence,
    });
  }

  const articles = Array.from(merged.values()).sort(byDateDesc).slice(0, limit);
  const kept = new Set(articles.map(articleKey));

  return { articles, newKeys: newKeys.filter(k => kept.has(k)) };
}

// Same accumulate-and-cap treatment for the excluded list.
export function mergeExcluded(previous, incoming, options = {}) {
  const { articles } = mergeArticles(previous, incoming, {
    ...options,
    limit: options.limit || MAX_STORED_EXCLUDED,
  });
  return articles;
}
