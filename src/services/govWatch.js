// Government Watch — Fetch and normalize government RSS/Atom feeds
// Supports fetching individual feeds for per-watcher polling

const PROXY_BASE = process.env.REACT_APP_PROXY_URL || '';
const USE_PROXY = process.env.NODE_ENV === 'production' || !!process.env.REACT_APP_PROXY_URL;

// Parse RSS/Atom XML into normalized article objects
function parseXmlFeed(xmlText, feedMeta) {
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlText, 'text/xml');

  const parseError = xml.querySelector('parsererror');
  if (parseError) return [];

  const articles = [];

  // Try RSS <item> elements first
  const rssItems = xml.querySelectorAll('item');
  if (rssItems.length > 0) {
    rssItems.forEach(item => {
      const title = item.querySelector('title')?.textContent?.trim() || '';
      const link = item.querySelector('link')?.textContent?.trim() || '';
      const pubDate = item.querySelector('pubDate')?.textContent?.trim() || '';
      const description = item.querySelector('description')?.textContent?.trim() || '';

      if (title) {
        articles.push({
          title: cleanHtml(title),
          source: feedMeta.name,
          sourceType: 'government',
          date: pubDate ? safeDate(pubDate) : new Date().toISOString(),
          snippet: cleanHtml(description).slice(0, 300),
          url: link,
          fullContent: '',
          provider: 'gov',
          govCategory: feedMeta.category,
          govLevel: feedMeta.level,
          govWatcherId: feedMeta.watcherId,
        });
      }
    });
    return articles;
  }

  // Try Atom <entry> elements
  const atomEntries = xml.querySelectorAll('entry');
  atomEntries.forEach(entry => {
    const title = entry.querySelector('title')?.textContent?.trim() || '';
    const link = entry.querySelector('link')?.getAttribute('href') || '';
    const updated = entry.querySelector('updated')?.textContent?.trim()
      || entry.querySelector('published')?.textContent?.trim() || '';
    const summary = entry.querySelector('summary')?.textContent?.trim()
      || entry.querySelector('content')?.textContent?.trim() || '';

    if (title) {
      articles.push({
        title: cleanHtml(title),
        source: feedMeta.name,
        sourceType: 'government',
        date: updated ? safeDate(updated) : new Date().toISOString(),
        snippet: cleanHtml(summary).slice(0, 300),
        url: link,
        fullContent: '',
        provider: 'gov',
        govCategory: feedMeta.category,
        govLevel: feedMeta.level,
        govWatcherId: feedMeta.watcherId,
      });
    }
  });

  return articles;
}

function cleanHtml(text) {
  if (!text) return '';
  return text.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
}

function safeDate(dateStr) {
  try {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

// Fetch a single government feed for a specific gov watcher
export async function fetchGovFeed(govWatcher) {
  const feedMeta = {
    name: govWatcher.name,
    category: govWatcher.category,
    level: govWatcher.level,
    watcherId: govWatcher.id,
  };

  try {
    let xmlText;
    const feedUrl = govWatcher.feedUrl;

    if (USE_PROXY) {
      const proxyUrl = `${PROXY_BASE}/api/news/gov?url=${encodeURIComponent(feedUrl)}`;
      const res = await fetch(proxyUrl);
      if (!res.ok) {
        console.warn(`[GovWatch] Proxy error for ${govWatcher.name}: ${res.status}`);
        return [];
      }
      xmlText = await res.text();
    } else {
      const res = await fetch(feedUrl);
      if (!res.ok) {
        console.warn(`[GovWatch] Direct fetch error for ${govWatcher.name}: ${res.status}`);
        return [];
      }
      xmlText = await res.text();
    }

    const articles = parseXmlFeed(xmlText, feedMeta);
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));
    return articles;
  } catch (err) {
    console.warn(`[GovWatch] Failed to fetch ${govWatcher.name}:`, err.message);
    return [];
  }
}

// Fetch all active gov watchers in parallel
export async function fetchAllGovWatchers(govWatchers = []) {
  const active = govWatchers.filter(gw => gw.active);
  if (active.length === 0) return [];

  console.log(`[GovWatch] Fetching ${active.length} gov watcher feeds...`);

  const results = await Promise.allSettled(
    active.map(gw => fetchGovFeed(gw))
  );

  const allArticles = results
    .filter(r => r.status === 'fulfilled')
    .flatMap(r => r.value);

  // Deduplicate by URL
  const seen = new Set();
  const unique = [];
  for (const article of allArticles) {
    const key = article.url || article.title;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(article);
    }
  }

  unique.sort((a, b) => new Date(b.date) - new Date(a.date));
  console.log(`[GovWatch] ${unique.length} total articles from ${active.length} watchers`);
  return unique;
}
