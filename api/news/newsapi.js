export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const apiKey = process.env.NEWSAPI_KEY;
  if (!apiKey) return res.status(500).json({ error: 'NEWSAPI_KEY not configured' });

  const { q, language, sortBy, pageSize, from, to } = req.query;
  const params = new URLSearchParams({
    q: q || '',
    language: language || 'en',
    sortBy: sortBy || 'publishedAt',
    pageSize: pageSize || '20',
    apiKey,
  });
  if (from) params.set('from', from);
  if (to) params.set('to', to);

  try {
    const response = await fetch(`https://newsapi.org/v2/everything?${params}`);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
