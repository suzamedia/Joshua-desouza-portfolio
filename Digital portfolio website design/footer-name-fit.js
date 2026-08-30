export function fitFooterName(el) {
  if (!el) return () => {};
  const parent = el.parentElement;
  const measure = () => {
    if (!el.isConnected || !parent) return;
    el.style.fontSize = '200px';
    const naturalWidth = el.scrollWidth;
    const targetWidth = parent.clientWidth;
    el.style.fontSize = naturalWidth ? (200 * targetWidth / naturalWidth * 0.97) + 'px' : '15.6vw';
  };
  measure();
  const ro = new ResizeObserver(measure);
  ro.observe(parent);
  window.addEventListener('resize', measure);
  return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
}
