const { configured, sign, eq } = require('./_auth');
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!configured()) return res.status(500).json({ error: 'Admin is not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD in Vercel.' });
  let b = req.body; if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } } b = b || {};
  const okE = eq(String(b.email || '').trim().toLowerCase(), String(process.env.ADMIN_EMAIL).trim().toLowerCase());
  const okP = eq(b.password || '', process.env.ADMIN_PASSWORD);
  if (!(okE && okP)) { await new Promise(r => setTimeout(r, 900)); return res.status(401).json({ error: 'Incorrect email or password.' }); }
  res.status(200).json({ token: sign(String(process.env.ADMIN_EMAIL)) });
};
