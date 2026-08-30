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
  var EASE = 'cubic-bezier(0.65,0,0.35,1)';

  function lockOverflow(on) {
    document.documentElement.style.overflowX = on ? 'hidden' : '';
  }

  function setBodyMotion(x, opacity, transition) {
    if (!document.body) return;
    document.body.style.transition = transition;
    document.body.style.transform = x === 0 ? '' : 'translateX(' + x + '%)';
    document.body.style.opacity = String(opacity);
  }

  function revealPage() {
    lockOverflow(true);
    setBodyMotion(100, 1, 'none');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        setBodyMotion(0, 1, 'transform 0.55s ' + EASE);
        setTimeout(function () {
          if (document.body) document.body.style.transform = '';
          lockOverflow(false);
        }, 570);
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

    lockOverflow(true);
    setBodyMotion(0, 1, 'none');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        setBodyMotion(-100, 1, 'transform 0.42s ' + EASE);
      });
    });

    if (previewMode && ROUTES[url.pathname]) {
      e.preventDefault();
      setTimeout(function () { window.location.href = ROUTES[url.pathname] + url.search + url.hash; }, 120);
    }
  }, true);
})();
