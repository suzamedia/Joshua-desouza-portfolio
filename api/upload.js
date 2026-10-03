const { verify } = require('./_auth');
const readBody = (req) => new Promise((ok, no) => { const c = []; let n = 0; req.on('data', d => { n += d.length; if (n > 4.4e6) { no(new Error('Image too large')); req.destroy(); } else c.push(d); }); req.on('end', () => ok(Buffer.concat(c))); req.on('error', no); });
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!verify(req)) return res.status(401).json({ error: 'Session expired. Log in again.' });
  try {
    const buf = Buffer.isBuffer(req.body) ? req.body : await readBody(req);
    const type = String(req.headers['x-content-type'] || 'image/webp');
    if (!/^image\/(webp|png|jpeg|gif|svg\+xml)$/.test(type)) return res.status(400).json({ error: 'Unsupported image type' });
    const name = String(req.headers['x-filename'] || 'image').replace(/[^a-z0-9._-]+/gi, '-').slice(-60);
    const { put } = await import('@vercel/blob');
    const r = await put('cms/' + name, buf, { access: 'public', contentType: type, addRandomSuffix: true });
    res.status(200).json({ url: r.url });
  } catch (e) { res.status(500).json({ error: 'Upload failed: ' + (e && e.message || e) }); }
};
