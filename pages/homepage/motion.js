(() => {
  'use strict';
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const control = document.getElementById('motion-toggle');
  const team = document.querySelector('.hero-team');
  let enabled = !preference.matches;
  let frameId = 0;
  let previous = 0;
  let lastScroll = window.scrollY;
  let impulse = 0;

  // Draw scenery particles only. The supplied character images are never modified.
  let seed = 240522;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const surfaces = [...document.querySelectorAll('.current-canvas')].map((canvas, surfaceIndex) => {
    const context = canvas.getContext('2d');
    const surface = { canvas, context, width: 1, height: 1, visible: false, count: 0,
      particles: Array.from({ length: surfaceIndex === 0 ? 18 : 36 }, (_, i) => ({
        depth: random(),
        angle: random() * Math.PI * 2,
        size: .8 + random() * .6,
        speed: .026 + random() * .025,
        tilt: random() * Math.PI,
        shape: .43 + random() * .35
      }))
    };
    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      surface.width = bounds.width;
      surface.height = bounds.height;
      canvas.width = Math.round(bounds.width * ratio);
      canvas.height = Math.round(bounds.height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      paint(surface, 0);
    };
    new ResizeObserver(resize).observe(canvas);
    return surface;
  });

  function cell(context, x, y, size, flatten, angle, opacity) {
    context.save();
    context.translate(x, y);
    context.rotate(angle);
    context.scale(1, flatten);
    context.globalAlpha = opacity;
    const outer = context.createRadialGradient(-size * .32, -size * .42, size * .02, 0, 0, size);
    outer.addColorStop(0, '#ffb0a0');
    outer.addColorStop(.34, '#ff685e');
    outer.addColorStop(.7, '#db2d3e');
    outer.addColorStop(1, '#7b1834');
    context.fillStyle = outer;
    context.beginPath();
    context.ellipse(0, 0, size, size, 0, 0, Math.PI * 2);
    context.fill();
    const well = context.createRadialGradient(size * .08, size * .1, size * .02, 0, 0, size * .67);
    well.addColorStop(0, '#82112f');
    well.addColorStop(.45, '#a71734');
    well.addColorStop(.8, '#e54149');
    well.addColorStop(1, '#ed4e5100');
    context.fillStyle = well;
    context.beginPath();
    context.ellipse(0, 0, size * .71, size * .74, 0, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }

  function paint(surface, dt) {
    const { context: ctx, width: w, height: h, particles, canvas } = surface;
    if (!ctx || !w || !h) return;
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      p.depth = (p.depth + dt * p.speed * (1 + impulse * .35)) % 1;
    }
    const hero = canvas.id === 'hero-current';
    for (const p of [...particles].sort((a, b) => a.depth - b.depth)) {
      const depth = p.depth;
      const spread = Math.pow(depth, 1.45);
      const x = w * .65 + Math.cos(p.angle + depth * .48) * spread * w * .82;
      const y = h * .42 + Math.sin(p.angle) * spread * h * .83 + depth * depth * h * .12;
      const size = (4 + spread * Math.min(w, 1100) * .058) * p.size;
      const alpha = Math.min(1, depth * 5, (1 - depth) * 10) * (hero ? .52 : .9);
      cell(ctx, x, y, size, p.shape, p.tilt + depth * 2.3, alpha);
    }
    canvas.dataset.renderCount = String(++surface.count);
  }

  function animate(now) {
    frameId = 0;
    const dt = previous ? Math.min((now - previous) / 1000, .05) : 0;
    previous = now;
    const scroll = window.scrollY;
    impulse = Math.min(2.5, impulse * .94 + Math.abs(scroll - lastScroll) * .003);
    lastScroll = scroll;
    if (team && surfaces[0]?.visible) team.style.setProperty('--scene-shift', `${Math.min(scroll * .018, 13)}px`);
    for (const surface of surfaces) if (surface.visible) paint(surface, dt);
    if (enabled && !document.hidden && surfaces.some(s => s.visible)) frameId = requestAnimationFrame(animate);
  }

  function run() {
    if (frameId) cancelAnimationFrame(frameId);
    frameId = 0;
    previous = 0;
    if (enabled && !document.hidden && surfaces.some(s => s.visible)) frameId = requestAnimationFrame(animate);
    surfaces.forEach(({ canvas }) => { canvas.dataset.motion = enabled ? 'running' : 'paused'; });
  }

  function update() {
    document.body.classList.toggle('motion-paused', !enabled);
    control?.setAttribute('aria-pressed', String(enabled));
    if (control) {
      control.querySelector('.motion-label').textContent = enabled ? 'Остановить движение' : 'Включить движение';
      control.querySelector('.motion-icon').textContent = enabled ? 'Ⅱ' : '▶';
    }
    run();
  }
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const surface = surfaces.find(s => s.canvas === entry.target);
      if (surface) surface.visible = entry.isIntersecting;
    }
    run();
  }, { rootMargin: '80px' });
  surfaces.forEach(s => observer.observe(s.canvas));
  control?.addEventListener('click', () => { enabled = !enabled; update(); });
  preference.addEventListener('change', () => { enabled = !preference.matches; update(); });
  document.addEventListener('visibilitychange', run);
  update();
})();
