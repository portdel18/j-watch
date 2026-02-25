// 3-layer geographic relevance scoring
// Layer 1: Text keyword matching (built)
// Layer 2: NER extraction (stubbed — future: spaCy / compromise.js)
// Layer 3: LLM scoring (stubbed — future: Claude API)

import {
  ALL_IDAHO_COUNTIES,
  ALL_IDAHO_CITIES,
  IDAHO_REGIONS,
  GEO_SYNONYMS,
  IDAHO_FACILITIES,
  FALSE_POSITIVES,
  COUNTY_SEATS,
  SOURCE_GEO,
} from '../data/geography';

// Layer 1: Keyword-based geographic matching
function layer1KeywordMatch(article, geoState, geoRegion, geoCustom) {
  const text = `${article.title} ${article.snippet} ${article.fullContent || ''}`.toLowerCase();
  const matchedLocations = [];
  let score = 0;

  // Check false positives first
  for (const fp of FALSE_POSITIVES) {
    if (fp.pattern.test(text)) {
      return { score: 0, confidence: 'low', matchedLocations: [], falsePositive: fp.actual };
    }
  }

  // State-level match
  if (geoState) {
    const stateLower = geoState.toLowerCase();
    if (text.includes(stateLower)) {
      score += 0.3;
      matchedLocations.push(geoState);
    }
    // Check synonyms
    for (const [synonym, targets] of Object.entries(GEO_SYNONYMS)) {
      if (text.includes(synonym.toLowerCase()) && targets.some(t => t.toLowerCase() === stateLower || t.toLowerCase().includes(stateLower))) {
        score += 0.2;
        matchedLocations.push(synonym);
      }
    }
  }

  // Region-level match
  if (geoRegion && IDAHO_REGIONS[geoRegion]) {
    const region = IDAHO_REGIONS[geoRegion];
    for (const county of region.counties) {
      if (text.includes(county.toLowerCase())) {
        score += 0.4;
        matchedLocations.push(`${county} County`);
      }
    }
    for (const city of region.cities) {
      if (text.includes(city.toLowerCase())) {
        score += 0.4;
        matchedLocations.push(city);
        // Also tag the county
        if (COUNTY_SEATS[city]) {
          matchedLocations.push(`${COUNTY_SEATS[city]} County`);
        }
      }
    }
  }

  // Custom geo filter
  if (geoCustom) {
    const customTerms = geoCustom.split(',').map(s => s.trim().toLowerCase());
    for (const term of customTerms) {
      if (term && text.includes(term)) {
        score += 0.5;
        matchedLocations.push(term);
      }
    }
  }

  // Check facilities
  for (const [facility, info] of Object.entries(IDAHO_FACILITIES)) {
    if (text.includes(facility.toLowerCase())) {
      score += 0.35;
      matchedLocations.push(info.name || facility);
      if (info.county) matchedLocations.push(`${info.county} County`);
    }
  }

  // County matches (broad)
  if (geoState && geoState.toLowerCase() === 'idaho') {
    for (const county of ALL_IDAHO_COUNTIES) {
      if (text.includes(county.toLowerCase() + ' county')) {
        score += 0.3;
        matchedLocations.push(`${county} County`);
      }
    }
    for (const city of ALL_IDAHO_CITIES) {
      if (text.includes(city.toLowerCase())) {
        score += 0.25;
        matchedLocations.push(city);
      }
    }
  }

  // Source geo prior — Idaho sources start with higher confidence
  if (article.source && SOURCE_GEO[article.source]) {
    const sourceGeo = SOURCE_GEO[article.source];
    if (geoState && sourceGeo.state && sourceGeo.state.toLowerCase() === geoState.toLowerCase()) {
      score += 0.2;
    }
  }

  // Cap score at 1.0
  score = Math.min(score, 1.0);

  const confidence = score >= 0.6 ? 'high' : score >= 0.3 ? 'medium' : 'low';

  return {
    score,
    confidence,
    matchedLocations: [...new Set(matchedLocations)],
  };
}

// Layer 2: NER extraction (stub)
// TODO: Integrate spaCy or compromise.js for named entity recognition
function layer2NERExtraction(article) {
  return {
    locations: [],
    entities: { people: [], organizations: [], facilities: [] },
    confidence: 'none',
  };
}

// Layer 3: LLM scoring via Claude API (stub)
// TODO: Integrate via backend proxy
async function layer3LLMScoring(articles, targetLocation) {
  // Will batch 5-10 articles per Claude call
  // Only called for "medium" confidence Layer 1 matches
  return articles.map(() => ({
    relevant: null,
    confidence: null,
    reason: 'LLM scoring not yet configured',
  }));
}

// Main scoring function — runs all layers
export function scoreArticle(article, watcher) {
  const { geoState, geoRegion, geoCustom } = watcher;

  // If no geo filters, everything matches
  if (!geoState && !geoRegion && !geoCustom) {
    return { score: 1.0, confidence: 'high', matchedLocations: [], layer: 0 };
  }

  // Layer 1: Keyword matching
  const l1 = layer1KeywordMatch(article, geoState, geoRegion, geoCustom);

  if (l1.falsePositive) {
    return { score: 0, confidence: 'low', matchedLocations: [], falsePositive: l1.falsePositive, layer: 1 };
  }

  return {
    ...l1,
    layer: 1,
  };
}

// Batch scoring for multiple articles against a watcher
export function scoreArticles(articles, watcher) {
  return articles.map(article => ({
    article,
    geo: scoreArticle(article, watcher),
  }));
}

export { layer1KeywordMatch, layer2NERExtraction, layer3LLMScoring };
