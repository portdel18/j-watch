import { forwardRateLimitHeaders, missingKey, upstreamFailure } from './_rateLimit.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const apiKey = process.env.GNEWS_KEY;
  if (!apiKey) return missingKey(res, 'GNEWS_KEY');

  const { q, lang, max, from, to } = req.query;
  const params = new URLSearchParams({
    q: q || '',
    lang: lang || 'en',
    max: max || '10',
    token: apiKey,
  });
  if (from) params.set('from', from);
  if (to) params.set('to', to);

  try {
    const response = await fetch(`https://gnews.io/api/v4/search?${params}`);
    const data = await response.json();
    forwardRateLimitHeaders(response, res);
    res.status(response.status).json(data);
  } catch (err) {
    upstreamFailure(res, err);
  }
}
