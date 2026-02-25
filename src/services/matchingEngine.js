// Core article filtering logic
// Filters by: keyword match + geographic relevance + date range

import { scoreArticle } from './geoScoring';

// Check if article matches keywords
function matchesKeywords(article, keywords) {
  if (!keywords || keywords.length === 0) return true;
  const text = `${article.title} ${article.snippet}`.toLowerCase();
  return keywords.some(kw => text.includes(kw.toLowerCase()));
}

// Check if article matches exclusion keywords
function matchesExclusion(article, excludeKeywords) {
  if (!excludeKeywords || excludeKeywords.length === 0) return false;
  const text = `${article.title} ${article.snippet}`.toLowerCase();
  return excludeKeywords.some(kw => text.includes(kw.toLowerCase()));
}

// Check if article matches tracked entities
function matchesEntities(article, trackedEntities) {
  if (!trackedEntities || trackedEntities.length === 0) return false;
  const text = `${article.title} ${article.snippet}`.toLowerCase();
  return trackedEntities.some(entity => text.includes(entity.toLowerCase()));
}

// Check if article is within date range
function matchesDateRange(article, watcher) {
  if (!article.date) return true;

  const articleDate = new Date(article.date);
  let dateFrom, dateTo;

  if (watcher.dateMode === 'rolling' || !watcher.dateMode) {
    const days = watcher.rollingDays || 7;
    dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - days);
    dateTo = new Date();
  } else {
    dateFrom = watcher.dateFrom ? new Date(watcher.dateFrom) : new Date(0);
    dateTo = watcher.dateTo ? new Date(watcher.dateTo) : new Date();
  }

  return articleDate >= dateFrom && articleDate <= dateTo;
}

// Main matching function — filters articles against a single watcher
export function matchArticles(articles, watcher) {
  const matched = [];
  const excluded = [];

  for (const article of articles) {
    // Step 1: Keyword match (fast, always runs)
    const keywordMatch = matchesKeywords(article, watcher.keywords);
    const entityMatch = matchesEntities(article, watcher.trackedEntities);

    // Must match keywords OR tracked entities
    if (!keywordMatch && !entityMatch) continue;

    // Step 2: Exclusion filter
    if (matchesExclusion(article, watcher.excludeKeywords)) {
      excluded.push({ ...article, excludeReason: 'matched exclusion keyword' });
      continue;
    }

    // Step 3: Geographic scoring
    const geoResult = scoreArticle(article, watcher);

    // Skip low-confidence geo matches unless no geo filters set
    if (geoResult.confidence === 'low' && geoResult.score < 0.1) continue;

    // Step 4: Date range filter
    if (!matchesDateRange(article, watcher)) continue;

    matched.push({
      ...article,
      geoScore: geoResult.score,
      geoConfidence: geoResult.confidence,
      matchedLocations: geoResult.matchedLocations || [],
      keywordMatch,
      entityMatch,
    });
  }

  // Sort by geo confidence, then date
  matched.sort((a, b) => {
    const confOrder = { high: 3, medium: 2, low: 1 };
    const confDiff = (confOrder[b.geoConfidence] || 0) - (confOrder[a.geoConfidence] || 0);
    if (confDiff !== 0) return confDiff;
    return new Date(b.date) - new Date(a.date);
  });

  return { matched, excluded };
}

// Match articles against all active watchers
export function matchAllWatchers(articles, watchers) {
  const results = {};

  for (const watcher of watchers) {
    if (!watcher.active) continue;
    const { matched, excluded } = matchArticles(articles, watcher);
    results[watcher.id] = { matched, excluded, watcher };
  }

  return results;
}

// Build search query from watcher keywords
export function buildSearchQuery(watcher) {
  const keywords = watcher.keywords || [];
  if (keywords.length === 0) return '';

  // Combine keywords with OR for broader search
  let query = keywords.join(' OR ');

  // Add geo context if available
  if (watcher.geoState) {
    query += ` ${watcher.geoState}`;
  }
  if (watcher.geoRegion) {
    query += ` ${watcher.geoRegion}`;
  }

  return query;
}
