// Shared helpers for the news provider proxies.
//
// The browser never talks to a provider directly in production — it talks to
// these functions. Anything the provider says about quota has to be forwarded
// or the client is left guessing, which is exactly how the local request
// counter used to drift away from reality.

const FORWARDED_HEADERS = [
  'retry-after',
  'x-ratelimit-limit',
  'x-ratelimit-remaining',
  'x-ratelimit-reset',
  'x-rate-limit-limit',
  'x-rate-limit-remaining',
  'x-rate-limit-reset',
];

export function forwardRateLimitHeaders(upstream, res) {
  const exposed = [];
  for (const name of FORWARDED_HEADERS) {
    const value = upstream.headers.get(name);
    if (value !== null && value !== undefined && value !== '') {
      res.setHeader(name, value);
      exposed.push(name);
    }
  }
  // Needed for the headers to be readable when the app is served from a
  // different origin than these functions (REACT_APP_PROXY_URL).
  if (exposed.length > 0) {
    res.setHeader('Access-Control-Expose-Headers', exposed.join(', '));
  }
}

// A missing key is a deployment problem, not a transient one. The `code` lets
// the client mark the provider unconfigured and stop spending polls on it
// instead of retrying a guaranteed failure every few minutes.
export function missingKey(res, envVar) {
  return res.status(500).json({
    error: `${envVar} not configured`,
    code: 'not_configured',
  });
}

export function upstreamFailure(res, err) {
  return res.status(502).json({
    error: err.message || 'Upstream request failed',
    code: 'upstream_error',
  });
}
