#!/usr/bin/env node
/**
 * validate-feeds.js — Check which government RSS feeds are alive
 *
 * Usage:
 *   node scripts/validate-feeds.js              # check all feeds
 *   node scripts/validate-feeds.js --federal    # federal only
 *   node scripts/validate-feeds.js --state CA   # single state (by 2-letter code or name)
 *   node scripts/validate-feeds.js --local      # local feeds only
 *   node scripts/validate-feeds.js --json       # output results as JSON
 *
 * No dependencies required — uses only Node built-ins (node 18+).
 */

const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// ---------------------------------------------------------------------------
// Parse the govFeeds.js file (ESM export) without requiring a bundler
// ---------------------------------------------------------------------------
function loadFeeds() {
  const src = fs.readFileSync(
    path.join(__dirname, '..', 'src', 'data', 'govFeeds.js'),
    'utf-8',
  );

  // Strip ESM export keywords so we can eval as plain JS
  const code = src
    .replace(/export\s+const\s+/g, 'const ')
    .replace(/export\s+function\s+/g, 'function ')
    .replace(/export\s*\{[^}]*\}/g, '');

  // Execute in a mini sandbox and return the arrays/objects
  const fn = new Function(code + '\nreturn { FEDERAL_FEEDS, STATE_FEEDS, LOCAL_FEEDS };');
  return fn();
}

// ---------------------------------------------------------------------------
// Fetch with timeout using built-in fetch (Node 18+)
// Falls back to http/https modules if fetch is unavailable
// ---------------------------------------------------------------------------
async function checkUrl(url, timeoutMs = 10000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const start = Date.now();
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'User-Agent': 'j-watch-feed-validator/1.0' },
    });
    const elapsed = Date.now() - start;

    // Some servers reject HEAD — retry with GET if we get 405
    if (res.status === 405) {
      clearTimeout(timer);
      const controller2 = new AbortController();
      const timer2 = setTimeout(() => controller2.abort(), timeoutMs);
      try {
        const res2 = await fetch(url, {
          method: 'GET',
          signal: controller2.signal,
          redirect: 'follow',
          headers: { 'User-Agent': 'j-watch-feed-validator/1.0' },
        });
        clearTimeout(timer2);
        return { status: res2.status, ok: res2.ok, ms: Date.now() - start, error: null };
      } catch (e2) {
        clearTimeout(timer2);
        return { status: null, ok: false, ms: Date.now() - start, error: e2.message };
      }
    }

    clearTimeout(timer);
    return { status: res.status, ok: res.ok, ms: elapsed, error: null };
  } catch (err) {
    clearTimeout(timer);
    const elapsed = Date.now() - start;
    const msg = err.name === 'AbortError' ? 'TIMEOUT' : err.message;
    return { status: null, ok: false, ms: elapsed, error: msg };
  }
}

// ---------------------------------------------------------------------------
// Concurrency limiter — run at most N promises at once
// ---------------------------------------------------------------------------
async function parallelMap(items, fn, concurrency = 15) {
  const results = new Array(items.length);
  let idx = 0;

  async function worker() {
    while (idx < items.length) {
      const i = idx++;
      results[i] = await fn(items[i], i);
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  return results;
}

// ---------------------------------------------------------------------------
// Pretty-print helpers
// ---------------------------------------------------------------------------
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';

function statusColor(result) {
  if (result.ok) return GREEN;
  if (result.status && result.status < 500) return YELLOW;
  return RED;
}

function statusLabel(result) {
  if (result.error) return result.error;
  return String(result.status);
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------
async function main() {
  const args = process.argv.slice(2);
  const jsonOutput = args.includes('--json');
  const federalOnly = args.includes('--federal');
  const localOnly = args.includes('--local');
  const stateIdx = args.indexOf('--state');
  const stateFilter = stateIdx !== -1 ? args[stateIdx + 1] : null;

  const { FEDERAL_FEEDS, STATE_FEEDS, LOCAL_FEEDS } = loadFeeds();

  // Build flat list of { id, name, url, group }
  const feeds = [];

  if (!stateFilter && !localOnly) {
    for (const f of FEDERAL_FEEDS) {
      feeds.push({ ...f, group: 'Federal' });
    }
  }

  if (!federalOnly && !localOnly) {
    for (const [state, list] of Object.entries(STATE_FEEDS)) {
      if (stateFilter) {
        const prefix = list[0]?.id?.split('-')[0]?.toUpperCase();
        if (
          state.toLowerCase() !== stateFilter.toLowerCase() &&
          prefix !== stateFilter.toUpperCase()
        ) {
          continue;
        }
      }
      for (const f of list) {
        feeds.push({ ...f, group: state });
      }
    }
  }

  if (!federalOnly || localOnly) {
    for (const [region, list] of Object.entries(LOCAL_FEEDS)) {
      if (stateFilter) {
        const prefix = list[0]?.id?.split('-')[0]?.toUpperCase();
        if (
          region.toLowerCase() !== stateFilter.toLowerCase() &&
          prefix !== stateFilter.toUpperCase()
        ) {
          continue;
        }
      }
      for (const f of list) {
        feeds.push({ ...f, group: `${region} (Local)` });
      }
    }
  }

  if (feeds.length === 0) {
    console.error('No feeds matched your filter.');
    process.exit(1);
  }

  if (!jsonOutput) {
    console.log(`\nChecking ${feeds.length} feeds (15 concurrent)...\n`);
  }

  let done = 0;
  const results = await parallelMap(
    feeds,
    async (feed) => {
      const result = await checkUrl(feed.url);
      done++;
      if (!jsonOutput) {
        const pct = Math.round((done / feeds.length) * 100);
        const col = statusColor(result);
        process.stdout.write(
          `${DIM}[${String(pct).padStart(3)}%]${RESET} ${col}${statusLabel(result).padEnd(8)}${RESET} ${feed.group} / ${feed.name} ${DIM}(${result.ms}ms)${RESET}\n`,
        );
      }
      return { ...feed, result };
    },
    15,
  );

  // Summarize
  const alive = results.filter((r) => r.result.ok);
  const dead = results.filter((r) => !r.result.ok);

  if (jsonOutput) {
    const output = {
      total: results.length,
      alive: alive.length,
      dead: dead.length,
      feeds: results.map((r) => ({
        id: r.id,
        name: r.name,
        group: r.group,
        url: r.url,
        status: r.result.status,
        ok: r.result.ok,
        ms: r.result.ms,
        error: r.result.error,
      })),
    };
    console.log(JSON.stringify(output, null, 2));
  } else {
    console.log(`\n${'─'.repeat(60)}`);
    console.log(`${GREEN}✓ Alive: ${alive.length}${RESET}  ${RED}✗ Dead/Error: ${dead.length}${RESET}  Total: ${results.length}`);

    if (dead.length > 0) {
      console.log(`\n${RED}Failed feeds:${RESET}`);
      for (const r of dead) {
        console.log(`  ${r.group} / ${r.name}`);
        console.log(`    ${DIM}${r.url}${RESET}`);
        console.log(`    ${YELLOW}${statusLabel(r.result)}${RESET}`);
      }
    }
    console.log();
  }

  // Write results to file for later reference
  const outPath = path.join(__dirname, '..', 'feed-validation-results.json');
  const output = {
    timestamp: new Date().toISOString(),
    total: results.length,
    alive: alive.length,
    dead: dead.length,
    feeds: results.map((r) => ({
      id: r.id,
      name: r.name,
      group: r.group,
      url: r.url,
      status: r.result.status,
      ok: r.result.ok,
      ms: r.result.ms,
      error: r.result.error,
    })),
  };
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
  if (!jsonOutput) {
    console.log(`Results saved to ${path.relative(process.cwd(), outPath)}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
