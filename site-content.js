let _p;
export function loadContent(fresh) {
  if (_p && !fresh) return _p;
  _p = (async () => {
    try {
      const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 4000);
      const r = await fetch('/api/content' + (fresh ? '?fresh=1' : ''), { signal: ctl.signal }); clearTimeout(t);
      if (!r.ok) return {};
      const d = await r.json();
      return d && typeof d === 'object' ? d : {};
    } catch (e) { return {}; }
  })();
  return _p;
}
