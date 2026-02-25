export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'text/xml; charset=utf-8');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { q } = req.query;
  const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(q || '')}&hl=en-US&gl=US&ceid=US:en`;

  try {
    const response = await fetch(rssUrl);
    const text = await response.text();
    res.status(response.status).send(text);
  } catch (err) {
    res.status(500).send(`<error>${err.message}</error>`);
  }
}
