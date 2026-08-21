(function () {
  if (window.__pageTransitionInit) return;
  window.__pageTransitionInit = true;

  var ROUTES = {
    '/home': 'index.html',
    '/union-work': 'Joshua DeSouza Portfolio.dc.html',
    '/freelance-work': 'Joshua DeSouza Freelance.dc.html',
    '/about-me': 'Joshua DeSouza About.dc.html',
    '/updates': 'Joshua DeSouza Press.dc.html',
    '/resume-unionwork': 'Joshua DeSouza Credits.dc.html',
    '/resume-freelancework': 'Joshua DeSouza Freelance Credits.dc.html'
  };
  var previewMode = !/(^|\.)jdesouza\.ca$/.test(location.hostname);

  var overlay = document.createElement('div');
  overlay.id = '__page-transition-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:#14130f;pointer-events:none;' +
    'transform:scaleX(1);transform-origin:right;transition:none;';

  function mountOverlay() {
    if (document.body && !document.body.contains(overlay)) document.body.appendChild(overlay);
  }
  mountOverlay();
  document.addEventListener('DOMContentLoaded', mountOverlay);

  function revealPage() {
    mountOverlay();
    overlay.style.transformOrigin = 'right';
    overlay.style.transition = 'none';
    overlay.style.transform = 'scaleX(1)';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        overlay.style.transition = 'transform 0.36s cubic-bezier(0.76,0,0.24,1)';
        overlay.style.transform = 'scaleX(0)';
      });
    });
  }
  if (document.readyState === 'complete') revealPage();
  else window.addEventListener('load', revealPage);

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href || href.charAt(0) === '#' || href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var url;
    try { url = new URL(href, location.href); } catch (err) { return; }
    if (url.origin !== location.origin) return;
    if (url.href.replace(/#.*$/, '') === location.href.replace(/#.*$/, '')) return;

    mountOverlay();
    overlay.style.transformOrigin = 'left';
    overlay.style.transition = 'none';
    overlay.style.transform = 'scaleX(0)';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        overlay.style.transition = 'transform 0.2s cubic-bezier(0.65,0,0.35,1)';
        overlay.style.transform = 'scaleX(1)';
      });
    });

    if (previewMode && ROUTES[url.pathname]) {
      e.preventDefault();
      setTimeout(function () { window.location.href = ROUTES[url.pathname] + url.search + url.hash; }, 210);
    }
  }, true);
})();
