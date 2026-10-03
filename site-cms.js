(function () {
  if (window.JDCMS) return;
  var TK = 'jd-admin-token', EK = 'jd-edit-on';
  function token() {
    var t = localStorage.getItem(TK); if (!t) return null;
    try { var p = JSON.parse(atob(t.split('.')[0].replace(/-/g, '+').replace(/_/g, '/'))); if (p.exp < Date.now()) { localStorage.removeItem(TK); return null; } } catch (e) { localStorage.removeItem(TK); return null; }
    return t;
  }
  function api(path, opts) {
    opts = opts || {}; opts.headers = Object.assign({}, opts.headers);
    var t = token(); if (t) opts.headers.Authorization = 'Bearer ' + t;
    return fetch(path, opts).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (d) {
        if (r.status === 401 && t) localStorage.removeItem(TK);
        if (!r.ok) throw new Error(d.error || ('Error ' + r.status));
        return d;
      });
    });
  }
  function resizeImage(file, max) {
    max = max || 1800;
    if (/svg|gif/.test(file.type)) return Promise.resolve(file);
    return new Promise(function (ok, no) {
      var img = new Image(), u = URL.createObjectURL(file);
      img.onload = function () {
        var s = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight)), w = Math.round(img.naturalWidth * s), h = Math.round(img.naturalHeight * s);
        var c = document.createElement('canvas'); c.width = w; c.height = h; c.getContext('2d').drawImage(img, 0, 0, w, h); URL.revokeObjectURL(u);
        c.toBlob(function (b) {
          if (b && b.type === 'image/webp') return ok(b);
          c.toBlob(function (p) { p ? ok(p) : no(new Error('Could not read image')); }, 'image/png');
        }, 'image/webp', 0.88);
      };
      img.onerror = function () { no(new Error('Could not read image')); };
      img.src = u;
    });
  }
  function upload(file) {
    return resizeImage(file).then(function (blob) {
      return api('/api/upload', { method: 'POST', headers: { 'Content-Type': 'application/octet-stream', 'x-content-type': blob.type || 'image/webp', 'x-filename': file.name || 'image' }, body: blob });
    }).then(function (d) { return d.url; });
  }
  window.JDCMS = { token: token, api: api, upload: upload, resizeImage: resizeImage, TK: TK, EK: EK };
  function boot() {
    if (document.body && document.body.hasAttribute('data-cms-admin')) return;
    var content = { text: {}, images: {} }, editing = false, dirtyImgs = {}, els = [];
    var INLINE = { BR: 1, STRONG: 1, EM: 1, B: 1, I: 1, A: 1, SMALL: 1, SUP: 1, SUB: 1 };
    var SKIPTAG = { SCRIPT: 1, STYLE: 1, CANVAS: 1, BUTTON: 1, INPUT: 1, TEXTAREA: 1, SELECT: 1, OPTION: 1, LABEL: 1, NOSCRIPT: 1, 'IMAGE-SLOT': 1, TITLE: 1, TEMPLATE: 1, HEAD: 1, HTML: 1, BODY: 1 };
    var SKIPSEL = '[data-cms-skip],[aria-hidden="true"],.contact-modal,form,svg,canvas,image-slot,.upcoming-slide,.upcoming-cards,.news-row,#recent-carousel,[data-screen-label^="Opening"],.hero-line,#jd-cms-bar,#jd-cms-img';
    function isCand(el) {
      if (SKIPTAG[el.tagName] || el.closest(SKIPSEL)) return false;
      if (!el.textContent.trim()) return false;
      for (var i = 0; i < el.children.length; i++) if (!INLINE[el.children[i].tagName]) return false;
      return true;
    }
    function scanText() {
      var all = document.body.querySelectorAll('*');
      for (var i = 0; i < all.length; i++) {
        var el = all[i];
        if (el.__jdKey !== undefined) continue;
        if (INLINE[el.tagName] && el.parentElement && el.parentElement.__jdKey !== undefined) continue;
        if (!isCand(el)) continue;
        var key = el.innerHTML.trim(); el.__jdKey = key; els.push(el);
        var ov = content.text && content.text[key];
        if (ov != null) el.innerHTML = ov;
        el.__jdCur = el.innerHTML.trim();
        if (editing) makeEditable(el, true);
      }
    }
    var URLRE = /url\(["']?([^"')]+)["']?\)/;
    function imgTargets() {
      var out = [], i, n;
      n = document.querySelectorAll('img'); for (i = 0; i < n.length; i++) if (!n[i].closest('#jd-cms-bar,#jd-cms-img')) out.push(n[i]);
      n = document.querySelectorAll('image-slot'); for (i = 0; i < n.length; i++) out.push(n[i]);
      n = document.querySelectorAll('[style*="url("]'); for (i = 0; i < n.length; i++) out.push(n[i]);
      return out;
    }
    function info(el) {
      if (el.tagName === 'IMG') return { get: function () { return el.getAttribute('src'); }, set: function (u) { el.setAttribute('src', u); } };
      if (el.tagName === 'IMAGE-SLOT') return { get: function () { return el.getAttribute('src'); }, set: function (u) { el.setAttribute('src', u); } };
      var m = (el.getAttribute('style') || '').match(URLRE); if (!m) return null;
      return { get: function () { var mm = (el.getAttribute('style') || '').match(URLRE); return mm && mm[1]; }, set: function (u) { var cur = info(el).get(); el.style.backgroundImage = el.style.backgroundImage.split(cur).join(u); } };
    }
    function scanImages() {
      var imgs = content.images || {}, t = imgTargets();
      for (var i = 0; i < t.length; i++) {
        var el = t[i], inf = info(el); if (!inf) continue;
        var cur = inf.get(); if (!cur) continue;
        if (el.__jdOrig === undefined || (imgs[cur] === undefined && cur !== el.__jdNew)) { el.__jdOrig = cur; }
        var want = imgs[el.__jdOrig];
        if (want && cur !== want) { el.__jdNew = want; inf.set(want); }
      }
    }
    var tmr;
    function rescan() { clearTimeout(tmr); tmr = setTimeout(function () { els = els.filter(function (e) { return document.contains(e); }); scanText(); scanImages(); }, 150); }
    function makeEditable(el, on) {
      if (on) { el.setAttribute('contenteditable', 'true'); el.setAttribute('spellcheck', 'true'); el.classList.add('jd-ed'); }
      else { el.removeAttribute('contenteditable'); el.removeAttribute('spellcheck'); el.classList.remove('jd-ed'); }
    }
    // ---- toolbar (admin only)
    var bar, status, editBtn, saveBtn, imgBtn, hoverEl = null, pendingTarget = null;
    var css = document.createElement('style');
    css.textContent = '.jd-ed{outline:1px dashed rgba(124,160,255,.0);outline-offset:3px;cursor:text;transition:outline-color .15s}.jd-ed:hover,.jd-ed:focus{outline-color:rgba(124,160,255,.85)}.jd-ed:focus{background:rgba(124,160,255,.08)}#jd-cms-bar button,#jd-cms-bar a{font:500 12px/1 "IBM Plex Mono",ui-monospace,monospace;letter-spacing:.1em;text-transform:uppercase;color:#f4f2ec;background:rgba(255,255,255,.1);border:0;border-radius:999px;padding:10px 14px;cursor:pointer;text-decoration:none}#jd-cms-bar button:hover,#jd-cms-bar a:hover{background:rgba(255,255,255,.2);color:#fff}#jd-cms-bar .pri{background:oklch(0.55 0.17 262)}@media print{#jd-cms-bar,#jd-cms-img{display:none!important}}';
    document.head.appendChild(css);
    function mk(tag, txt, fn, cls) { var b = document.createElement(tag); b.textContent = txt; if (cls) b.className = cls; if (fn) b.addEventListener('click', fn); return b; }
    function setStatus(t) { if (status) status.textContent = t; }
    function dirtyCount() {
      var n = Object.keys(dirtyImgs).length;
      els.forEach(function (e) { if (e.isConnected && e.getAttribute('contenteditable') && e.innerHTML.trim() !== e.__jdCur) n++; });
      return n;
    }
    function buildBar() {
      bar = document.createElement('div'); bar.id = 'jd-cms-bar';
      bar.style.cssText = 'position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:2147483000;display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:center;max-width:calc(100vw - 24px);padding:8px;border-radius:999px;background:rgba(20,19,15,.92);backdrop-filter:blur(14px);box-shadow:0 18px 40px rgba(0,0,0,.4);color:#f4f2ec';
      status = document.createElement('span'); status.style.cssText = 'font:12px "IBM Plex Mono",ui-monospace,monospace;letter-spacing:.06em;padding:0 8px;color:#b8b4a9';
      editBtn = mk('button', '', toggleEdit); saveBtn = mk('button', 'Save changes', save, 'pri'); saveBtn.style.display = 'none';
      var mgr = mk('a', 'News & projects'); mgr.href = '/admin';
      var out = mk('button', 'Log out', function () { localStorage.removeItem(TK); sessionStorage.removeItem(EK); location.reload(); });
      [status, editBtn, saveBtn, mgr, out].forEach(function (x) { bar.appendChild(x); });
      document.body.appendChild(bar); refreshBar();
    }
    function refreshBar() {
      editBtn.textContent = editing ? 'Stop editing' : 'Edit this page';
      saveBtn.style.display = editing ? '' : 'none';
      setStatus(editing ? 'Click any text to edit · hover images to replace' : 'Admin');
    }
    function toggleEdit() {
      if (editing && dirtyCount() && !confirm('You have unsaved changes. Stop editing and discard them?')) return;
      if (editing) { sessionStorage.removeItem(EK); location.reload(); return; }
      editing = true; sessionStorage.setItem(EK, '1'); els.forEach(function (e) { makeEditable(e, true); }); refreshBar();
    }
    function save() {
      var patch = { text: {}, images: {} }, changed = [];
      els.forEach(function (e) {
        if (!e.isConnected) return; var h = e.innerHTML.trim();
        if (h !== e.__jdCur) { patch.text[e.__jdKey] = h === e.__jdKey ? null : h; changed.push([e, h]); }
      });
      Object.keys(dirtyImgs).forEach(function (k) { patch.images[k] = dirtyImgs[k]; });
      if (!changed.length && !Object.keys(dirtyImgs).length) return setStatus('Nothing to save');
      setStatus('Saving…');
      api('/api/save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patch) }).then(function () {
        changed.forEach(function (c) { c[0].__jdCur = c[1]; });
        Object.keys(patch.text).forEach(function (k) { if (patch.text[k] === null) delete content.text[k]; else content.text[k] = patch.text[k]; });
        Object.keys(patch.images).forEach(function (k) { content.images[k] = patch.images[k]; });
        dirtyImgs = {}; setStatus('Saved ✓');
      }).catch(function (e) { setStatus(e.message); if (!token()) setTimeout(function () { location.href = '/admin'; }, 1500); });
    }
    function bindEditing() {
      document.addEventListener('click', function (e) {
        if (!editing) return; var a = e.target.closest && e.target.closest('a');
        if (a && !a.closest('#jd-cms-bar')) { e.preventDefault(); }
      }, true);
      document.addEventListener('keydown', function (e) {
        if (!editing || !e.target.getAttribute || !e.target.getAttribute('contenteditable')) return;
        if (e.key === 'Enter') { e.preventDefault(); document.execCommand('insertLineBreak'); }
      });
      document.addEventListener('paste', function (e) {
        if (!editing || !e.target.getAttribute || !e.target.getAttribute('contenteditable')) return;
        e.preventDefault(); var t = (e.clipboardData || window.clipboardData).getData('text/plain'); document.execCommand('insertText', false, t);
      });
      document.addEventListener('input', function () { if (editing) setStatus('Unsaved changes'); });
      window.addEventListener('beforeunload', function (e) { if (editing && dirtyCount()) { e.preventDefault(); e.returnValue = ''; } });
      imgBtn = mk('button', 'Replace image', function () {
        if (!pendingTarget) return; var t = pendingTarget, f = document.createElement('input'); f.type = 'file'; f.accept = 'image/*';
        f.onchange = function () {
          if (!f.files[0]) return; setStatus('Uploading…');
          upload(f.files[0]).then(function (url) {
            var inf = info(t); if (!inf) return; var orig = t.__jdOrig || inf.get();
            t.__jdOrig = orig; t.__jdNew = url; inf.set(url); dirtyImgs[orig] = url; setStatus('Image ready · press Save changes');
          }).catch(function (er) { setStatus(er.message); });
        };
        f.click();
      });
      imgBtn.id = 'jd-cms-img'; imgBtn.style.cssText = 'position:fixed;z-index:2147482999;display:none;font:500 12px/1 "IBM Plex Mono",ui-monospace,monospace;letter-spacing:.1em;text-transform:uppercase;color:#fff;background:oklch(0.55 0.17 262);border:0;border-radius:999px;padding:10px 14px;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.35)';
      document.body.appendChild(imgBtn);
      document.addEventListener('mousemove', function (e) {
        if (!editing) return;
        if (e.target === imgBtn) return;
        var stack = document.elementsFromPoint(e.clientX, e.clientY), hit = null;
        for (var i = 0; i < stack.length; i++) {
          var s = stack[i];
          if (s.closest('#jd-cms-bar')) break;
          if ((s.tagName === 'IMG' || s.tagName === 'IMAGE-SLOT' || /url\(/.test(s.getAttribute('style') || '')) && info(s)) { var r = s.getBoundingClientRect(); if (r.width > 60 && r.height > 60) { hit = s; break; } }
        }
        if (!hit) { imgBtn.style.display = 'none'; pendingTarget = null; return; }
        pendingTarget = hit; var r2 = hit.getBoundingClientRect();
        imgBtn.style.display = 'block'; imgBtn.style.left = Math.max(8, Math.min(innerWidth - 150, r2.right - 142)) + 'px'; imgBtn.style.top = Math.max(8, Math.min(innerHeight - 50, r2.top + 10)) + 'px';
      }, { passive: true });
    }
    function start() {
      var admin = !!token();
      if (admin) { editing = sessionStorage.getItem(EK) === '1'; buildBar(); bindEditing(); }
      fetch('/api/content').then(function (r) { return r.ok ? r.json() : {}; }).catch(function () { return {}; }).then(function (c) {
        content = { text: (c && c.text) || {}, images: (c && c.images) || {} };
        scanText(); scanImages();
        new MutationObserver(function () { rescan(); }).observe(document.body, { childList: true, subtree: true, characterData: false });
      });
    }
    start();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
