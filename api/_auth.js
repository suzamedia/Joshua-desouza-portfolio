const crypto = require('crypto');
const b64 = (s) => Buffer.from(s).toString('base64url');
const secret = () => (process.env.SESSION_SECRET || '') + '|' + (process.env.ADMIN_PASSWORD || '') + '|' + (process.env.ADMIN_EMAIL || '');
const hmac = (s) => crypto.createHmac('sha256', secret()).update(s).digest('base64url');
const eq = (a, b) => { const x = crypto.createHash('sha256').update(String(a)).digest(), y = crypto.createHash('sha256').update(String(b)).digest(); return crypto.timingSafeEqual(x, y); };
function configured() { return !!(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD); }
function sign(email) { const p = b64(JSON.stringify({ e: email, exp: Date.now() + 12 * 3600 * 1000 })); return p + '.' + hmac(p); }
function verify(req) {
  if (!configured()) return false;
  const h = req.headers.authorization || ''; const t = h.startsWith('Bearer ') ? h.slice(7) : '';
  const [p, sig] = t.split('.'); if (!p || !sig || !eq(sig, hmac(p))) return false;
  try { const d = JSON.parse(Buffer.from(p, 'base64url').toString()); return d.exp > Date.now() && String(d.e).toLowerCase() === String(process.env.ADMIN_EMAIL).toLowerCase(); } catch (e) { return false; }
}
module.exports = { configured, sign, verify, eq };
