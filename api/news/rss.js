import { forwardRateLimitHeaders, upstreamFailure } from './_rateLimit.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { q } = req.query;
  const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(q || '')}&hl=en-US&gl=US&ceid=US:en`;

  try {
    const response = await fetch(rssUrl);
    const text = await response.text();
    forwardRateLimitHeaders(response, res);
    // Only claim XML when the fetch actually succeeded, so a failure isn't
    // handed to the client as an empty-looking feed
    if (!response.ok) {
      return res.status(response.status).json({
        error: `Google News RSS returned ${response.status}`,
        code: 'upstream_error',
      });
    }
    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    res.status(200).send(text);
  } catch (err) {
    upstreamFailure(res, err);
  }
}
