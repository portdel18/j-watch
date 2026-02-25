export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const apiKey = process.env.NEWSDATA_KEY;
  if (!apiKey) return res.status(500).json({ error: 'NEWSDATA_KEY not configured' });

  const { q, language } = req.query;
  const params = new URLSearchParams({
    q: q || '',
    language: language || 'en',
    apikey: apiKey,
  });

  try {
    const response = await fetch(`https://newsdata.io/api/1/latest?${params}`);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
