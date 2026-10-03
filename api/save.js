const { verify } = require('./_auth');
const { read } = require('./content');
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!verify(req)) return res.status(401).json({ error: 'Session expired. Log in again.' });
  let patch = req.body; if (typeof patch === 'string') { try { patch = JSON.parse(patch); } catch (e) { patch = null; } }
  if (!patch || typeof patch !== 'object') return res.status(400).json({ error: 'Bad request' });
  try {
    const cur = await read();
    for (const k of ['text', 'images']) {
      if (patch[k] && typeof patch[k] === 'object') {
        cur[k] = cur[k] || {};
        for (const [key, v] of Object.entries(patch[k])) { if (v === null) delete cur[k][key]; else cur[k][key] = String(v); }
      }
    }
    for (const k of ['news', 'upcoming']) if (Array.isArray(patch[k])) cur[k] = patch[k];
    const body = JSON.stringify(cur);
    if (body.length > 900000) return res.status(413).json({ error: 'Content too large' });
    const { put } = await import('@vercel/blob');
    await put('site-content.json', body, { access: 'public', contentType: 'application/json', addRandomSuffix: false, allowOverwrite: true, cacheControlMaxAge: 60 });
    res.status(200).json({ ok: true });
  } catch (e) { res.status(500).json({ error: 'Could not save: ' + (e && e.message || e) }); }
};
