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

  function lockOverflow(on) {
    document.documentElement.style.overflowX = on ? 'hidden' : '';
  }

  function setBodyMotion(opacity, transition) {
    if (!document.body) return;
    document.body.style.transition = transition;
    document.body.style.opacity = String(opacity);
  }

  function revealPage() {
    requestAnimationFrame(function () {
      setBodyMotion(1, 'opacity 0.18s ease-out');
      setTimeout(function () { lockOverflow(false); }, 200);
    });
  }

  // Hide immediately so the page never paints at full opacity before fading in.
  lockOverflow(true);
  if (document.body) setBodyMotion(0, 'none');
  else document.addEventListener('DOMContentLoaded', function () { setBodyMotion(0, 'none'); });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', revealPage);
  else revealPage();

  // bfcache / Back button: the DOM is restored with the faded-out inline opacity
  // and this script does not re-run, so force the page visible again.
  window.addEventListener('pageshow', function (e) {
    if (!e.persisted) return;
    lockOverflow(false);
    setBodyMotion(1, 'none');
  });

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

    lockOverflow(true);
    setBodyMotion(1, 'none');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        setBodyMotion(0, 'opacity 0.13s ease-in');
      });
    });

    // If navigation never happens (cancelled, blocked, slow), don't leave a blank page.
    setTimeout(function () {
      lockOverflow(false);
      setBodyMotion(1, 'opacity 0.2s ease-out');
    }, 1500);

    if (previewMode && ROUTES[url.pathname]) {
      e.preventDefault();
      setTimeout(function () { window.location.href = ROUTES[url.pathname] + url.search + url.hash; }, 140);
    }
  }, false);
})();
