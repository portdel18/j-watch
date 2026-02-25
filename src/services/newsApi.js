// Multi-provider news fetching service
// Supports: NewsAPI.org, GNews, NewsData.io, Google News RSS
// Rate limit tracking, caching, deduplication, smart provider selection

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

// Rate limit tracking (localStorage until Firebase migration)
function getRateLimits() {
  const today = new Date().toISOString().split('T')[0];
  const stored = JSON.parse(localStorage.getItem('jwatch_rateLimits') || '{}');
  if (stored.date !== today) {
    return {
      date: today,
      newsapi: { used: 0, limit: PROVIDERS.newsapi.dailyLimit },
      gnews: { used: 0, limit: PROVIDERS.gnews.dailyLimit },
      newsdata: { used: 0, limit: PROVIDERS.newsdata.dailyLimit },
    };
  }
  return stored;
}

function saveRateLimits(limits) {
  localStorage.setItem('jwatch_rateLimits', JSON.stringify(limits));
}

function recordUsage(provider) {
  const limits = getRateLimits();
  if (limits[provider]) {
    limits[provider].used += 1;
  }
  saveRateLimits(limits);
}

function hasQuota(provider) {
  const limits = getRateLimits();
  if (!limits[provider]) return true;
  return limits[provider].used < limits[provider].limit;
}

export function getQuotaStatus() {
  const limits = getRateLimits();
  return {
    newsapi: limits.newsapi || { used: 0, limit: 100 },
    gnews: limits.gnews || { used: 0, limit: 100 },
    newsdata: limits.newsdata || { used: 0, limit: 200 },
    rss: { used: 0, limit: Infinity },
  };
}

// Article cache for deduplication
const articleCache = new Map();

function deduplicateArticles(articles) {
  const unique = [];
  for (const article of articles) {
    const key = article.url || `${article.title}-${article.source}`;
    if (!articleCache.has(key)) {
      articleCache.set(key, true);
      unique.push(article);
    }
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
  const apiKey = process.env.REACT_APP_NEWSAPI_KEY;
  if (!apiKey || !hasQuota('newsapi')) return [];

  const proxyUrl = process.env.REACT_APP_PROXY_URL;
  const baseUrl = proxyUrl
    ? `${proxyUrl}/api/news/newsapi`
    : 'https://newsapi.org/v2/everything';

  const params = new URLSearchParams({
    q: query,
    language: 'en',
    sortBy: 'publishedAt',
    pageSize: '20',
    ...(proxyUrl ? {} : { apiKey }),
  });

  if (options.from) params.set('from', options.from);
  if (options.to) params.set('to', options.to);

  try {
    const res = await fetch(`${baseUrl}?${params}`);
    if (!res.ok) throw new Error(`NewsAPI ${res.status}`);
    const data = await res.json();
    recordUsage('newsapi');
    return (data.articles || []).map(a => normalizeArticle(a, 'newsapi'));
  } catch (err) {
    console.warn('[NewsAPI] Fetch failed:', err.message);
    return [];
  }
}

async function fetchFromGNews(query, options = {}) {
  const apiKey = process.env.REACT_APP_GNEWS_KEY;
  if (!apiKey || !hasQuota('gnews')) return [];

  const proxyUrl = process.env.REACT_APP_PROXY_URL;
  const baseUrl = proxyUrl
    ? `${proxyUrl}/api/news/gnews`
    : 'https://gnews.io/api/v4/search';

  const params = new URLSearchParams({
    q: query,
    lang: 'en',
    max: '10',
    ...(proxyUrl ? {} : { token: apiKey }),
  });

  if (options.from) params.set('from', options.from);
  if (options.to) params.set('to', options.to);

  try {
    const res = await fetch(`${baseUrl}?${params}`);
    if (!res.ok) throw new Error(`GNews ${res.status}`);
    const data = await res.json();
    recordUsage('gnews');
    return (data.articles || []).map(a => normalizeArticle(a, 'gnews'));
  } catch (err) {
    console.warn('[GNews] Fetch failed:', err.message);
    return [];
  }
}

async function fetchFromNewsData(query, options = {}) {
  const apiKey = process.env.REACT_APP_NEWSDATA_KEY;
  if (!apiKey || !hasQuota('newsdata')) return [];

  const proxyUrl = process.env.REACT_APP_PROXY_URL;
  const baseUrl = proxyUrl
    ? `${proxyUrl}/api/news/newsdata`
    : 'https://newsdata.io/api/1/latest';

  const params = new URLSearchParams({
    q: query,
    language: 'en',
    ...(proxyUrl ? {} : { apikey: apiKey }),
  });

  try {
    const res = await fetch(`${baseUrl}?${params}`);
    if (!res.ok) throw new Error(`NewsData ${res.status}`);
    const data = await res.json();
    recordUsage('newsdata');
    return (data.results || []).map(a => normalizeArticle(a, 'newsdata'));
  } catch (err) {
    console.warn('[NewsData] Fetch failed:', err.message);
    return [];
  }
}

async function fetchFromGoogleRSS(query) {
  const proxyUrl = process.env.REACT_APP_PROXY_URL;

  try {
    let xmlText;
    if (proxyUrl) {
      const res = await fetch(`${proxyUrl}/api/news/rss?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error(`RSS proxy ${res.status}`);
      xmlText = await res.text();
    } else {
      // Direct fetch — may be blocked by CORS in browser
      const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
      const res = await fetch(rssUrl);
      if (!res.ok) throw new Error(`RSS ${res.status}`);
      xmlText = await res.text();
    }

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
    console.warn('[Google RSS] Fetch failed:', err.message);
    return [];
  }
}

// Provider rotation — round-robin, max 2 per poll, RSS as fallback
let rotationIndex = 0;
const PROVIDER_ORDER = ['newsapi', 'gnews', 'newsdata'];

function selectProviders() {
  const available = PROVIDER_ORDER.filter(p => {
    if (p === 'newsapi' && !process.env.REACT_APP_NEWSAPI_KEY) return false;
    if (p === 'gnews' && !process.env.REACT_APP_GNEWS_KEY) return false;
    if (p === 'newsdata' && !process.env.REACT_APP_NEWSDATA_KEY) return false;
    return hasQuota(p);
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

export function clearArticleCache() {
  articleCache.clear();
}

export { PROVIDERS };
