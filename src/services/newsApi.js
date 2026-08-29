// Multi-provider news fetching service
// Supports: NewsAPI.org, GNews, NewsData.io, Google News RSS
// Rate limit tracking, caching, deduplication, smart provider selection

import { articleKey } from './articleStore';
import { recordRequest, recordSuccess, recordFailure, isAvailable } from './quota';

// In production (Vercel), route through /api/news/* serverless functions
// to avoid CORS and keep API keys server-side.
const PROXY_BASE = process.env.REACT_APP_PROXY_URL || '';
const USE_PROXY = process.env.NODE_ENV === 'production' || !!process.env.REACT_APP_PROXY_URL;

const PROVIDERS = {
  newsapi: {
    name: 'NewsAPI.org',
    dailyLimit: 100,
    envKey: 'REACT_APP_NEWSAPI_KEY',
  },
  gnews: {
    name: 'GNews',
    dailyLimit: 100,
    envKey: 'REACT_APP_GNEWS_KEY',
  },
  newsdata: {
    name: 'NewsData.io',
    dailyLimit: 200,
    envKey: 'REACT_APP_NEWSDATA_KEY',
  },
  rss: {
    name: 'Google News RSS',
    dailyLimit: Infinity,
    envKey: null,
  },
};

// Quota and provider health live in quota.js, which treats what the provider
// says (429, a quota-exceeded 403, a rate-limit header) as the truth and the
// local request count as a mere estimate.
export { getQuotaStatus, clearBlock as retryProvider, STATUS as PROVIDER_STATUS } from './quota';

// Read an error body without letting a non-JSON response throw. The body text
// is what tells a quota-exceeded 403 apart from a rejected-key 403.
async function readErrorBody(res) {
  try {
    return (await res.text()).slice(0, 500);
  } catch {
    return '';
  }
}

// One place for "we asked, here's what came back", so every provider records
// its outcome the same way.
async function requestProvider(provider, url) {
  recordRequest(provider);
  const res = await fetch(url);

  if (!res.ok) {
    const bodyText = await readErrorBody(res);
    recordFailure(provider, { status: res.status, bodyText, headers: res.headers });
    const err = new Error(`${PROVIDERS[provider].name} ${res.status}`);
    err.handled = true;
    throw err;
  }

  recordSuccess(provider, res.headers);
  return res;
}

// Network-level failures (offline, DNS, CORS) never reached the provider, so
// they get the transient-error backoff rather than being treated as quota.
function noteFetchError(provider, err) {
  if (!err.handled) {
    recordFailure(provider, { status: 0, message: err.message });
  }
  console.warn(`[${PROVIDERS[provider].name}] Fetch failed:`, err.message);
}

// Deduplicate within a single fetch — the same story often comes back from
// more than one provider in the same poll.
//
// This is deliberately NOT a cross-poll cache. A persistent cache here would
// make every article invisible after the first time it was fetched, so a
// second poll would return only whatever happened to be brand new. Suppressing
// already-seen articles is the article store's job (see articleStore.js),
// which keeps them in the feed instead of dropping them on the floor.
function deduplicateArticles(articles) {
  const seen = new Set();
  const unique = [];
  for (const article of articles) {
    const key = articleKey(article);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    unique.push(article);
  }
  return unique;
}

// Source classification
const NATIONAL_OUTLETS = new Set([
  'CNN', 'Fox News', 'NBC News', 'CBS News', 'ABC News', 'NPR',
  'The New York Times', 'Washington Post', 'USA Today', 'BBC News',
  'The Wall Street Journal', 'Los Angeles Times', 'Politico', 'The Hill',
  'Bloomberg', 'MSNBC', 'The Guardian', 'HuffPost', 'Axios', 'Vox',
  'The Daily Beast', 'BuzzFeed News', 'Reuters', 'Associated Press',
]);

export function classifySource(sourceName) {
  if (!sourceName) return 'unknown';
  if (NATIONAL_OUTLETS.has(sourceName)) return 'national';
  if (['Associated Press', 'AP', 'Reuters', 'UPI', 'AFP'].includes(sourceName)) return 'wire';
  // Idaho local sources
  const idahoLocals = [
    'Idaho Statesman', 'Times-News', 'Idaho Press', 'Post Register',
    'Lewiston Tribune', 'Coeur d\'Alene Press', 'Moscow-Pullman Daily News',
    'Idaho Mountain Express', 'Idaho State Journal', 'BoiseDev', 'Idaho Capital Sun',
  ];
  if (idahoLocals.some(s => sourceName.includes(s))) return 'local';
  const broadcasts = ['KTVB', 'KIVI', 'KBOI', 'KMVT', 'KIDK', 'KIFI', 'KLEW'];
  if (broadcasts.some(s => sourceName.includes(s))) return 'broadcast';
  return 'unknown';
}

// Normalize article from different providers into a common format
function normalizeArticle(raw, provider) {
  switch (provider) {
    case 'newsapi':
      return {
        title: raw.title || '',
        source: raw.source?.name || 'Unknown',
        sourceType: classifySource(raw.source?.name),
        date: raw.publishedAt || new Date().toISOString(),
        snippet: raw.description || '',
        url: raw.url || '',
        fullContent: raw.content || '',
        provider: 'newsapi',
      };
    case 'gnews':
      return {
        title: raw.title || '',
        source: raw.source?.name || 'Unknown',
        sourceType: classifySource(raw.source?.name),
        date: raw.publishedAt || new Date().toISOString(),
        snippet: raw.description || '',
        url: raw.url || '',
        fullContent: raw.content || '',
        provider: 'gnews',
      };
    case 'newsdata':
      return {
        title: raw.title || '',
        source: raw.source_id || 'Unknown',
        sourceType: classifySource(raw.source_id),
        date: raw.pubDate || new Date().toISOString(),
        snippet: raw.description || '',
        url: raw.link || '',
        fullContent: raw.content || '',
        provider: 'newsdata',
      };
    case 'rss':
      return {
        title: raw.title || '',
        source: raw.source || 'Google News',
        sourceType: classifySource(raw.source),
        date: raw.pubDate || new Date().toISOString(),
        snippet: raw.description || '',
        url: raw.link || '',
        fullContent: '',
        provider: 'rss',
      };
    default:
      return raw;
  }
}

// Provider fetchers
async function fetchFromNewsAPI(query, options = {}) {
  if (!USE_PROXY && !process.env.REACT_APP_NEWSAPI_KEY) return [];
  if (!isAvailable('newsapi')) return [];

  const baseUrl = USE_PROXY
    ? `${PROXY_BASE}/api/news/newsapi`
    : 'https://newsapi.org/v2/everything';

  const params = new URLSearchParams({
    q: query,
    language: 'en',
    sortBy: 'publishedAt',
    pageSize: '20',
    ...(USE_PROXY ? {} : { apiKey: process.env.REACT_APP_NEWSAPI_KEY }),
  });

  if (options.from) params.set('from', options.from);
  if (options.to) params.set('to', options.to);

  try {
    const res = await requestProvider('newsapi', `${baseUrl}?${params}`);
    const data = await res.json();
    // NewsAPI can answer 200 with an error envelope; don't read that as
    // "no articles today"
    if (data.status === 'error') {
      recordFailure('newsapi', {
        status: res.status,
        bodyText: `${data.code || ''} ${data.message || ''}`,
        message: data.message,
      });
      return [];
    }
    return (data.articles || []).map(a => normalizeArticle(a, 'newsapi'));
  } catch (err) {
    noteFetchError('newsapi', err);
    return [];
  }
}

async function fetchFromGNews(query, options = {}) {
  if (!USE_PROXY && !process.env.REACT_APP_GNEWS_KEY) return [];
  if (!isAvailable('gnews')) return [];

  const baseUrl = USE_PROXY
    ? `${PROXY_BASE}/api/news/gnews`
    : 'https://gnews.io/api/v4/search';

  const params = new URLSearchParams({
    q: query,
    lang: 'en',
    max: '10',
    ...(USE_PROXY ? {} : { token: process.env.REACT_APP_GNEWS_KEY }),
  });

  if (options.from) params.set('from', options.from);
  if (options.to) params.set('to', options.to);

  try {
    const res = await requestProvider('gnews', `${baseUrl}?${params}`);
    const data = await res.json();
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      recordFailure('gnews', {
        status: res.status,
        bodyText: data.errors.join(' '),
        message: data.errors[0],
      });
      return [];
    }
    return (data.articles || []).map(a => normalizeArticle(a, 'gnews'));
  } catch (err) {
    noteFetchError('gnews', err);
    return [];
  }
}

async function fetchFromNewsData(query, options = {}) {
  if (!USE_PROXY && !process.env.REACT_APP_NEWSDATA_KEY) return [];
  if (!isAvailable('newsdata')) return [];

  const baseUrl = USE_PROXY
    ? `${PROXY_BASE}/api/news/newsdata`
    : 'https://newsdata.io/api/1/latest';

  const params = new URLSearchParams({
    q: query,
    language: 'en',
    ...(USE_PROXY ? {} : { apikey: process.env.REACT_APP_NEWSDATA_KEY }),
  });

  try {
    const res = await requestProvider('newsdata', `${baseUrl}?${params}`);
    const data = await res.json();
    if (data.status === 'error') {
      recordFailure('newsdata', {
        status: res.status,
        bodyText: JSON.stringify(data.results || data),
        message: data.results?.message,
      });
      return [];
    }
    return (data.results || []).map(a => normalizeArticle(a, 'newsdata'));
  } catch (err) {
    noteFetchError('newsdata', err);
    return [];
  }
}

async function fetchFromGoogleRSS(query) {
  // RSS has no quota, but it can still be down — and when it is, it is the
  // last line of fallback, so its health belongs on the dashboard too.
  if (!isAvailable('rss')) return [];

  try {
    const url = USE_PROXY
      ? `${PROXY_BASE}/api/news/rss?q=${encodeURIComponent(query)}`
      : `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
    const res = await requestProvider('rss', url);
    const xmlText = await res.text();

    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, 'text/xml');
    const items = xml.querySelectorAll('item');
    const articles = [];

    items.forEach((item) => {
      const title = item.querySelector('title')?.textContent || '';
      const link = item.querySelector('link')?.textContent || '';
      const pubDate = item.querySelector('pubDate')?.textContent || '';
      const description = item.querySelector('description')?.textContent || '';
      // Extract source from title (Google RSS format: "Title - Source")
      const sourceParts = title.split(' - ');
      const source = sourceParts.length > 1 ? sourceParts.pop().trim() : 'Google News';
      const cleanTitle = sourceParts.join(' - ').trim();

      articles.push(normalizeArticle({
        title: cleanTitle,
        source,
        link,
        pubDate: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        description: description.replace(/<[^>]+>/g, ''),
      }, 'rss'));
    });

    return articles;
  } catch (err) {
    noteFetchError('rss', err);
    return [];
  }
}

// Provider rotation — round-robin, max 2 per poll, RSS as fallback
let rotationIndex = 0;
const PROVIDER_ORDER = ['newsapi', 'gnews', 'newsdata'];

function selectProviders() {
  const available = PROVIDER_ORDER.filter(p => {
    // When using proxy, server handles API keys — try all providers
    if (!USE_PROXY) {
      if (p === 'newsapi' && !process.env.REACT_APP_NEWSAPI_KEY) return false;
      if (p === 'gnews' && !process.env.REACT_APP_GNEWS_KEY) return false;
      if (p === 'newsdata' && !process.env.REACT_APP_NEWSDATA_KEY) return false;
    }
    // Skips providers that are out of quota, blocked on a rejected key, or
    // backing off after an error — so a spent provider costs no requests
    return isAvailable(p);
  });

  if (available.length === 0) return ['rss'];

  // Pick up to 2 providers via round-robin
  const selected = [];
  for (let i = 0; i < Math.min(2, available.length); i++) {
    const idx = (rotationIndex + i) % available.length;
    selected.push(available[idx]);
  }
  rotationIndex = (rotationIndex + 1) % Math.max(available.length, 1);

  return selected;
}

const FETCHERS = {
  newsapi: fetchFromNewsAPI,
  gnews: fetchFromGNews,
  newsdata: fetchFromNewsData,
  rss: fetchFromGoogleRSS,
};

// Main fetch function
export async function fetchArticles(query, options = {}) {
  const providers = options.turboMode
    ? [selectProviders()[0] || 'rss']
    : selectProviders();

  console.log(`[NewsAPI] Fetching from: ${providers.join(', ')}`);

  const results = await Promise.all(
    providers.map(p => FETCHERS[p](query, options))
  );

  let articles = results.flat();

  // Always try RSS as fallback if no results from paid providers
  if (articles.length === 0 && !providers.includes('rss')) {
    console.log('[NewsAPI] No results from paid providers, falling back to RSS');
    const rssArticles = await fetchFromGoogleRSS(query);
    articles = rssArticles;
  }

  return deduplicateArticles(articles);
}

export { PROVIDERS };
