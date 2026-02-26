// Government Watch — Fetch and normalize government RSS/Atom feeds
// Uses the /api/news/gov proxy in production to avoid CORS

import { getGovFeedUrls } from '../data/govFeeds';

const PROXY_BASE = process.env.REACT_APP_PROXY_URL || '';
const USE_PROXY = process.env.NODE_ENV === 'production' || !!process.env.REACT_APP_PROXY_URL;

// Parse RSS/Atom XML into normalized article objects
function parseXmlFeed(xmlText, feedMeta) {
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlText, 'text/xml');

  // Check for parse errors
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

// Fetch a single government feed
async function fetchSingleFeed(feed, level) {
  const feedMeta = { ...feed, level };

  try {
    let xmlText;

    if (USE_PROXY) {
      const proxyUrl = `${PROXY_BASE}/api/news/gov?url=${encodeURIComponent(feed.url)}`;
      const res = await fetch(proxyUrl);
      if (!res.ok) {
        console.warn(`[GovWatch] Proxy error for ${feed.name}: ${res.status}`);
        return [];
      }
      xmlText = await res.text();
    } else {
      // Direct fetch in dev — may be blocked by CORS
      const res = await fetch(feed.url);
      if (!res.ok) {
        console.warn(`[GovWatch] Direct fetch error for ${feed.name}: ${res.status}`);
        return [];
      }
      xmlText = await res.text();
    }

    return parseXmlFeed(xmlText, feedMeta);
  } catch (err) {
    console.warn(`[GovWatch] Failed to fetch ${feed.name}:`, err.message);
    return [];
  }
}

// Main: Fetch all configured government feeds
export async function fetchGovArticles(govSettings = {}) {
  const { enabled, federal, govState } = govSettings;
  if (!enabled) return [];

  const feeds = getGovFeedUrls({ federal, state: govState });
  if (feeds.length === 0) return [];

  console.log(`[GovWatch] Fetching ${feeds.length} government feeds...`);

  // Fetch all feeds in parallel (they're free, no rate limits)
  const results = await Promise.allSettled(
    feeds.map(feed => {
      const level = feed.id.includes('-gov') || feed.id.includes('-leg')
        ? 'state' : 'federal';
      return fetchSingleFeed(feed, level);
    })
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

  // Sort by date, newest first
  unique.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Apply keyword filter if set
  const filterKeywords = govSettings.govFilter
    ? govSettings.govFilter.split(',').map(k => k.trim().toLowerCase()).filter(Boolean)
    : [];

  if (filterKeywords.length > 0) {
    const filtered = unique.filter(article => {
      const text = `${article.title} ${article.snippet}`.toLowerCase();
      return filterKeywords.some(kw => text.includes(kw));
    });
    console.log(`[GovWatch] ${unique.length} articles fetched, ${filtered.length} after keyword filter`);
    return filtered;
  }

  console.log(`[GovWatch] ${unique.length} articles fetched`);
  return unique;
}
