// Serverless function: Fetch a government RSS feed and return parsed XML
// Used by the Gov Watch feature to proxy .gov RSS feeds through Vercel
// to avoid CORS issues in the browser.

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  // Only allow .gov, .mil, and .us domains for security
  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  const hostname = parsedUrl.hostname.toLowerCase();
  const allowedSuffixes = ['.gov', '.mil', '.us'];
  const isAllowed = allowedSuffixes.some(suffix => hostname.endsWith(suffix));

  if (!isAllowed) {
    return res.status(403).json({ error: 'Only .gov, .mil, and .us domains are allowed' });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'JWatch/1.0 (Government News Monitor)',
        'Accept': 'application/rss+xml, application/xml, application/atom+xml, text/xml, */*',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Upstream returned ${response.status}`,
        url,
      });
    }

    const contentType = response.headers.get('content-type') || 'text/xml';
    const text = await response.text();

    // Return as XML
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.status(200).send(text);
  } catch (err) {
    const message = err.name === 'TimeoutError' ? 'Feed request timed out' : err.message;
    res.status(502).json({ error: message, url });
  }
}
