// Round Carousel — vanilla DOM/CSS 3D ring port (no React deps).
// initRoundCarousel(mountEl, imageSrcs, options) -> cleanup function.
// Tap (no drag) calls options.onClick.

export function initRoundCarousel(mountEl, imageSrcs, options) {
  const {
    speed = 2, direction = 'right', dragEnabled = true, sensitivity = 3.2,
    tilt = -11, perspective = 1200, cornerRadius = 20, innerDim = 4.5,
    background = 'transparent', widthRatio = 0.5, maxImageWidth = 420,
    aspect = 234 / 475, onClick,
  } = options || {};

  const images = (imageSrcs || []).filter(Boolean);
  const count = images.length;
  if (!count) return () => {};
  const angle = 360 / count;
  const spacingFactor = 1.15;

  mountEl.innerHTML = '';
  // overflow:hidden lives on this plain 2D element; `perspective` (the 3D
  // context) is established one level down on perspEl. Combining the two
  // on the same element lets 3D-transformed children escape clipping in
  // Chromium/WebKit, so they're kept apart on purpose.
  Object.assign(mountEl.style, {
    position: 'relative', width: '100%', height: '100%',
    overflow: 'hidden', background,
    cursor: dragEnabled ? 'grab' : 'default', touchAction: 'none',
  });

  const perspEl = document.createElement('div');
  Object.assign(perspEl.style, {
    width: '100%', height: '100%', display: 'flex', alignItems: 'center',
    justifyContent: 'center', perspective: perspective + 'px',
  });
  mountEl.appendChild(perspEl);

  const tiltWrap = document.createElement('div');
  Object.assign(tiltWrap.style, { transformStyle: 'preserve-3d', transform: `rotateX(${tilt}deg)` });
  perspEl.appendChild(tiltWrap);

  const ring = document.createElement('div');
  Object.assign(ring.style, { position: 'relative', transformStyle: 'preserve-3d' });
  tiltWrap.appendChild(ring);

  const itemEls = images.map((src) => {
    const item = document.createElement('div');
    Object.assign(item.style, { position: 'absolute', inset: 0, transformStyle: 'preserve-3d' });
    const front = document.createElement('div');
    Object.assign(front.style, {
      position: 'absolute', inset: 0, borderRadius: cornerRadius + 'px', overflow: 'hidden',
      backfaceVisibility: 'hidden', backgroundSize: 'cover', backgroundPosition: 'center',
      backgroundImage: `url("${src.replace(/"/g, '\\"')}")`, boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
    });
    const back = document.createElement('div');
    Object.assign(back.style, {
      position: 'absolute', inset: 0, borderRadius: cornerRadius + 'px', overflow: 'hidden',
      backfaceVisibility: 'hidden', backgroundSize: 'cover', backgroundPosition: 'center',
      backgroundImage: `url("${src.replace(/"/g, '\\"')}")`, transform: 'rotateY(180deg)', filter: `brightness(${innerDim / 10})`,
    });
    item.appendChild(front); item.appendChild(back);
    ring.appendChild(item);
    return item;
  });

  let radius = 0;
  function layout() {
    const rect = mountEl.getBoundingClientRect();
    const imageWidth = Math.min(maxImageWidth, rect.width * widthRatio);
    const imageHeight = imageWidth * aspect;
    radius = (imageWidth * spacingFactor) / (2 * Math.tan(Math.PI / count));
    ring.style.width = imageWidth + 'px';
    ring.style.height = imageHeight + 'px';
    itemEls.forEach((item, i) => { item.style.transform = `rotateY(${i * angle}deg) translateZ(${radius}px)`; });
    applyRingTransform();
  }

  let rotY = 0, vel = 0, last = 0, dragActive = false, dragX = 0, dragged = false, downX = 0, downY = 0;
  const degPerSec = speed * 6 * (direction === 'left' ? -1 : 1);
  function applyRingTransform() { ring.style.transform = `translateZ(${-radius}px) rotateY(${rotY}deg)`; }

  let rafId;
  function tick(now) {
    const dt = last ? (now - last) / 1000 : 0;
    last = now;
    const f = Math.min(dt, 0.1);
    if (!dragActive) {
      if (Math.abs(vel) > 0.01) { rotY += vel * f; vel *= 0.94; }
      else { rotY += degPerSec * f; }
    }
    applyRingTransform();
    rafId = requestAnimationFrame(tick);
  }
  rafId = requestAnimationFrame(tick);

  const ro = new ResizeObserver(layout);
  ro.observe(mountEl);
  layout();

  function onPointerDown(e) {
    if (!dragEnabled) return;
    mountEl.setPointerCapture?.(e.pointerId);
    dragActive = true; dragX = e.clientX; downX = e.clientX; downY = e.clientY; dragged = false; vel = 0;
    mountEl.style.cursor = 'grabbing';
  }
  function onPointerMove(e) {
    if (!dragActive) return;
    const dx = e.clientX - dragX;
    dragX = e.clientX;
    if (Math.abs(e.clientX - downX) + Math.abs(e.clientY - downY) > 6) dragged = true;
    const k = 0.3 * sensitivity;
    rotY += dx * k; vel = dx * k * 60;
  }
  function onPointerUp(e) {
    mountEl.releasePointerCapture?.(e.pointerId);
    dragActive = false;
    mountEl.style.cursor = dragEnabled ? 'grab' : 'default';
    if (!dragged && onClick) onClick();
  }
  mountEl.addEventListener('pointerdown', onPointerDown);
  mountEl.addEventListener('pointermove', onPointerMove);
  mountEl.addEventListener('pointerup', onPointerUp);
  mountEl.addEventListener('pointercancel', onPointerUp);

  return function cleanup() {
    cancelAnimationFrame(rafId);
    ro.disconnect();
    mountEl.removeEventListener('pointerdown', onPointerDown);
    mountEl.removeEventListener('pointermove', onPointerMove);
    mountEl.removeEventListener('pointerup', onPointerUp);
    mountEl.removeEventListener('pointercancel', onPointerUp);
    mountEl.innerHTML = '';
  };
}
