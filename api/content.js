const { verify } = require('./_auth');
const FILE = 'site-content.json';
async function read() {
  const { list } = await import('@vercel/blob');
  const { blobs } = await list({ prefix: FILE, limit: 5 });
  const b = blobs.find(x => x.pathname === FILE);
  if (!b) return {};
  const r = await fetch(b.url + '?t=' + Date.now());
  return r.ok ? r.json() : {};
}
module.exports = async (req, res) => {
  try {
    const fresh = req.query && req.query.fresh && verify(req);
    res.setHeader('Cache-Control', fresh ? 'no-store' : 's-maxage=15, stale-while-revalidate=60');
    res.status(200).json(await read());
  } catch (e) { res.setHeader('Cache-Control', 'no-store'); res.status(200).json({}); }
};
module.exports.read = read;
