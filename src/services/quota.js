// Provider quota and health tracking.
//
// The local request counter is only ever an ESTIMATE — it lives in one
// browser's localStorage, so it knows nothing about polls from your phone,
// yesterday's tab that is still open, or a cleared cache. The provider is the
// only authority on whether you have quota left, so anything it tells us
// (429, 403 "quota exceeded", a rate-limit header) overrides the estimate.

export const PROVIDER_LIMITS = {
  newsapi: 100,
  gnews: 100,
  newsdata: 200,
  rss: Infinity,
};

const STORAGE_KEY = 'jwatch_providerQuota';
const LEGACY_KEY = 'jwatch_rateLimits';
const TRACKED = ['newsapi', 'gnews', 'newsdata', 'rss'];

// Why a provider is unusable right now.
export const STATUS = {
  OK: 'ok',
  EXHAUSTED: 'exhausted',     // provider says the quota is gone
  UNAUTHORIZED: 'unauthorized', // bad, missing or rejected key
  UNCONFIGURED: 'unconfigured', // our own proxy has no key for it
  ERROR: 'error',             // upstream/network trouble — retry with backoff
};

// A block for a bad key or a spent quota lasts until the next UTC day; a
// transient error backs off briefly and escalates if it keeps happening.
const ERROR_BACKOFF_MS = [30e3, 60e3, 2 * 60e3, 5 * 60e3, 15 * 60e3, 30 * 60e3];

export function utcDay(now = Date.now()) {
  return new Date(now).toISOString().slice(0, 10);
}

export function nextUtcMidnight(now = Date.now()) {
  const d = new Date(now);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1, 0, 0, 0, 0);
}

function blankProvider(provider) {
  return {
    used: 0,
    limit: PROVIDER_LIMITS[provider] ?? Infinity,
    remaining: null,      // authoritative count, when the provider sends one
    status: STATUS.OK,
    blockedUntil: 0,
    consecutiveFailures: 0,
    lastError: null,
    lastErrorAt: null,
  };
}

function blankState(now) {
  const providers = {};
  for (const p of TRACKED) providers[p] = blankProvider(p);
  return { date: utcDay(now), providers };
}

// Carry over today's counts from the pre-quota.js storage format so upgrading
// mid-day doesn't hand you a fresh 0/100 you haven't earned.
function migrateLegacy(state, now) {
  try {
    const raw = localStorage.getItem(LEGACY_KEY);
    if (!raw) return state;
    const legacy = JSON.parse(raw);
    if (legacy && legacy.date === utcDay(now)) {
      for (const p of TRACKED) {
        if (legacy[p] && typeof legacy[p].used === 'number') {
          state.providers[p].used = legacy[p].used;
        }
      }
    }
    localStorage.removeItem(LEGACY_KEY);
  } catch {
    // A corrupt legacy blob is not worth failing over
  }
  return state;
}

function read(now = Date.now()) {
  let state;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    state = raw ? JSON.parse(raw) : null;
  } catch {
    state = null;
  }

  if (!state || !state.providers) {
    return migrateLegacy(blankState(now), now);
  }

  // New UTC day — counts reset, and so do quota blocks. A bad key is still a
  // bad key, but it costs one request a day to find out it was fixed.
  if (state.date !== utcDay(now)) {
    return blankState(now);
  }

  // Fill in any provider added since the state was written, and restore limits
  // that JSON cannot represent — RSS's Infinity serializes to null.
  for (const p of TRACKED) {
    if (!state.providers[p]) state.providers[p] = blankProvider(p);
    const entry = state.providers[p];
    if (typeof entry.limit !== 'number' || !Number.isFinite(entry.limit)) {
      entry.limit = PROVIDER_LIMITS[p] ?? Infinity;
    }
  }
  return state;
}

function write(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or blocked — tracking is best-effort, never fatal
  }
  return state;
}

function update(provider, mutator, now = Date.now()) {
  const state = read(now);
  const entry = state.providers[provider];
  if (!entry) return state;
  mutator(entry, state);
  return write(state);
}

// ─── Recording ───────────────────────────────────────────────────────

// Count the request as it goes out. The old code counted only successful
// responses, so a provider that answered 429 all day still looked untouched
// and got hammered on every poll.
export function recordRequest(provider, now = Date.now()) {
  update(provider, entry => {
    entry.used += 1;
    if (entry.remaining !== null) entry.remaining = Math.max(0, entry.remaining - 1);
  }, now);
}

// Pull an authoritative remaining count out of the response when one is there.
// Nothing is assumed: if the header is absent the local estimate stands.
function readRateLimitHeaders(headers) {
  if (!headers || typeof headers.get !== 'function') return {};
  const num = (name) => {
    const raw = headers.get(name);
    if (raw === null || raw === undefined || raw === '') return null;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : null;
  };
  return {
    remaining: num('x-ratelimit-remaining') ?? num('x-rate-limit-remaining'),
    limit: num('x-ratelimit-limit') ?? num('x-rate-limit-limit'),
    retryAfter: headers.get('retry-after'),
  };
}

function retryAfterToMs(retryAfter, now) {
  if (!retryAfter) return null;
  const seconds = Number(retryAfter);
  if (Number.isFinite(seconds)) return now + seconds * 1000;
  const asDate = Date.parse(retryAfter);
  return Number.isFinite(asDate) ? asDate : null;
}

export function recordSuccess(provider, headers, now = Date.now()) {
  const { remaining, limit } = readRateLimitHeaders(headers);
  update(provider, entry => {
    entry.status = STATUS.OK;
    entry.blockedUntil = 0;
    entry.consecutiveFailures = 0;
    entry.lastError = null;
    entry.lastErrorAt = null;
    if (limit !== null && limit > 0) entry.limit = limit;
    if (remaining !== null) {
      // Provider's number wins over our guess
      entry.remaining = remaining;
      if (Number.isFinite(entry.limit)) entry.used = Math.max(0, entry.limit - remaining);
    }
  }, now);
}

// Work out what a failed response actually means. Providers disagree on how
// they say "you're out of quota" — NewsAPI and NewsData use 429, GNews uses
// 403 — so the body is checked for quota wording before calling a 403 an
// authentication problem.
export function classifyFailure(status, bodyText = '') {
  const body = String(bodyText || '').toLowerCase();
  const mentionsQuota = /quota|rate.?limit|ratelimit|too many requests|limit exceeded|maximum requests/.test(body);
  const mentionsKey = /api.?key|apikey|token|unauthorized|invalid.?key|not configured/.test(body);

  if (status === 429) return STATUS.EXHAUSTED;
  if (status === 403) return mentionsQuota ? STATUS.EXHAUSTED : STATUS.UNAUTHORIZED;
  if (status === 401) return STATUS.UNAUTHORIZED;
  if (status === 500 && /not configured/.test(body)) return STATUS.UNCONFIGURED;
  if (mentionsQuota && status >= 400) return STATUS.EXHAUSTED;
  if (mentionsKey && status >= 400 && status < 500) return STATUS.UNAUTHORIZED;
  return STATUS.ERROR;
}

export function recordFailure(provider, { status = 0, bodyText = '', headers = null, message = '' } = {}, now = Date.now()) {
  const kind = status === 0 ? STATUS.ERROR : classifyFailure(status, bodyText);
  const { retryAfter } = readRateLimitHeaders(headers);
  const retryAt = retryAfterToMs(retryAfter, now);

  update(provider, entry => {
    entry.status = kind;
    entry.consecutiveFailures += 1;
    entry.lastError = message || describeFailure(kind, status);
    entry.lastErrorAt = new Date(now).toISOString();

    if (kind === STATUS.EXHAUSTED) {
      // Believe the provider over the counter: it says there is nothing left.
      if (Number.isFinite(entry.limit)) entry.used = entry.limit;
      entry.remaining = 0;
      entry.blockedUntil = retryAt || nextUtcMidnight(now);
    } else if (kind === STATUS.UNAUTHORIZED || kind === STATUS.UNCONFIGURED) {
      // Retrying a rejected key every five minutes helps nobody
      entry.blockedUntil = retryAt || nextUtcMidnight(now);
    } else {
      const step = Math.min(entry.consecutiveFailures - 1, ERROR_BACKOFF_MS.length - 1);
      entry.blockedUntil = retryAt || (now + ERROR_BACKOFF_MS[step]);
    }
  }, now);
}

function describeFailure(kind, status) {
  switch (kind) {
    case STATUS.EXHAUSTED: return `Daily quota reached (HTTP ${status})`;
    case STATUS.UNAUTHORIZED: return `API key rejected (HTTP ${status})`;
    case STATUS.UNCONFIGURED: return 'No API key configured on the server';
    default: return status ? `Request failed (HTTP ${status})` : 'Network request failed';
  }
}

// Clear a block so the next poll tries this provider again — for when you've
// just fixed a key and don't want to wait for the UTC rollover.
export function clearBlock(provider, now = Date.now()) {
  update(provider, entry => {
    entry.status = STATUS.OK;
    entry.blockedUntil = 0;
    entry.consecutiveFailures = 0;
    entry.lastError = null;
  }, now);
}

// ─── Reading ─────────────────────────────────────────────────────────

export function isAvailable(provider, now = Date.now()) {
  const entry = read(now).providers[provider];
  if (!entry) return true;

  // An explicit block is the provider's own verdict and outranks the local
  // estimate in both directions: while it stands nothing gets through, and
  // once it expires we try again even though the counters still read spent.
  // Without this, honouring a `Retry-After: 120` would still leave the
  // provider sidelined until the next UTC day.
  if (entry.blockedUntil) return now >= entry.blockedUntil;

  if (entry.remaining !== null && entry.remaining <= 0) return false;
  if (Number.isFinite(entry.limit) && entry.used >= entry.limit) return false;
  return true;
}

// Full per-provider picture for the sidebar: counts, why it is unavailable,
// and when it comes back.
export function getQuotaStatus(now = Date.now()) {
  const state = read(now);
  const out = {};
  for (const p of TRACKED) {
    const entry = state.providers[p];
    const blocked = !!entry.blockedUntil && now < entry.blockedUntil;
    out[p] = {
      ...entry,
      blocked,
      available: isAvailable(p, now),
      // A remaining count from the provider is the truth; otherwise it's ours
      estimated: entry.remaining === null,
      resetsAt: blocked ? entry.blockedUntil : null,
    };
  }
  return out;
}

// Test seam — lets a test start from a known state.
export function resetQuotaState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LEGACY_KEY);
  } catch {
    // ignore
  }
}
