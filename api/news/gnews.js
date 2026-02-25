export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const apiKey = process.env.GNEWS_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GNEWS_KEY not configured' });

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
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
