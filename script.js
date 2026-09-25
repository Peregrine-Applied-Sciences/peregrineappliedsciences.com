const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

menuButton?.addEventListener('click', () => {
  const isOpen = nav?.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(Boolean(isOpen)));
});

document.querySelectorAll('.site-nav a').forEach(link => {
  link.addEventListener('click', () => {
    nav?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});

const page = document.body.dataset.page;
if (page) {
  document.querySelector(`[data-nav="${page}"]`)?.classList.add('active');
}

function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach(item => item.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });

  items.forEach(item => observer.observe(item));
}

function initRoutingCanvas() {
  const canvas = document.getElementById('routingCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const state = {
    width: 0,
    height: 0,
    dpr: 1,
    time: 0,
    mouseX: 0,
    mouseY: 0,
    targetMouseX: 0,
    targetMouseY: 0,
    focus: null
  };

  const nodes = [
    { id: 'fovea', x: .71, y: .47, r: 8, label: 'FOVEA' },
    { id: 'p360', x: .84, y: .66, r: 5, label: 'P-360' },
    { id: 'pacn', x: .89, y: .27, r: 5, label: 'PACN' },
    { id: 'nodes', x: .61, y: .75, r: 5, label: 'GROUND' },
    { id: 'sensor-a', x: .66, y: .21, r: 3, label: 'RF' },
    { id: 'sensor-b', x: .95, y: .49, r: 3, label: 'EO/IR' },
    { id: 'network', x: .75, y: .82, r: 3, label: 'NETWORK' }
  ];

  const links = [
    ['nodes', 'fovea'],
    ['fovea', 'pacn'],
    ['fovea', 'p360'],
    ['sensor-a', 'fovea'],
    ['sensor-b', 'fovea'],
    ['network', 'fovea'],
    ['nodes', 'p360'],
    ['p360', 'pacn']
  ];

  function resize() {
    const bounds = canvas.getBoundingClientRect();
    state.dpr = Math.min(window.devicePixelRatio || 1, 2);
    state.width = Math.max(320, bounds.width);
    state.height = Math.max(500, bounds.height);
    canvas.width = Math.round(state.width * state.dpr);
    canvas.height = Math.round(state.height * state.dpr);
    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
  }

  function project(node) {
    const parallaxX = state.mouseX * 14;
    const parallaxY = state.mouseY * 9;
    return {
      x: node.x * state.width + parallaxX * (node.x - .5),
      y: node.y * state.height + parallaxY * (node.y - .5)
    };
  }

  function drawPerspectiveGrid() {
    const cx = state.width * .78;
    const horizonY = state.height * .37;
    const floorY = state.height * .95;
    const topWidth = state.width * .19;
    const bottomWidth = state.width * .72;

    ctx.save();
    ctx.strokeStyle = 'rgba(16,19,20,.105)';
    ctx.lineWidth = 1;

    const horizontalCount = 7;
    for (let i = 0; i < horizontalCount; i++) {
      const t = i / (horizontalCount - 1);
      const eased = t * t;
      const y = horizonY + (floorY - horizonY) * eased;
      const halfWidth = (topWidth + (bottomWidth - topWidth) * eased) / 2;
      ctx.beginPath();
      ctx.moveTo(cx - halfWidth, y);
      ctx.lineTo(cx + halfWidth, y);
      ctx.stroke();
    }

    const verticalCount = 9;
    for (let i = 0; i < verticalCount; i++) {
      const t = i / (verticalCount - 1);
      const topX = cx - topWidth / 2 + topWidth * t;
      const bottomX = cx - bottomWidth / 2 + bottomWidth * t;
      ctx.beginPath();
      ctx.moveTo(topX, horizonY);
      ctx.lineTo(bottomX, floorY);
      ctx.stroke();
    }

    ctx.restore();
  }

  function curve(a, b, bend = .16) {
    const pa = project(a);
    const pb = project(b);
    const dx = pb.x - pa.x;
    const dy = pb.y - pa.y;
    const nx = -dy;
    const ny = dx;
    const magnitude = Math.max(1, Math.hypot(nx, ny));
    const offset = Math.min(110, Math.hypot(dx, dy) * bend);
    const mx = (pa.x + pb.x) / 2 + (nx / magnitude) * offset;
    const my = (pa.y + pb.y) / 2 + (ny / magnitude) * offset;

    return { pa, pb, cx: mx, cy: my };
  }

  function quadPoint(q, t) {
    const mt = 1 - t;
    return {
      x: mt * mt * q.pa.x + 2 * mt * t * q.cx + t * t * q.pb.x,
      y: mt * mt * q.pa.y + 2 * mt * t * q.cy + t * t * q.pb.y
    };
  }

  function drawLink(a, b, index) {
    const q = curve(a, b, index % 2 === 0 ? .13 : -.11);
    const focusActive = !state.focus || state.focus === a.id || state.focus === b.id;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(q.pa.x, q.pa.y);
    ctx.quadraticCurveTo(q.cx, q.cy, q.pb.x, q.pb.y);
    ctx.setLineDash([5, 9]);
    ctx.lineDashOffset = -state.time * 11;
    ctx.strokeStyle = focusActive ? 'rgba(16,19,20,.38)' : 'rgba(16,19,20,.08)';
    ctx.lineWidth = focusActive ? 1.15 : .8;
    ctx.stroke();

    if (focusActive && !prefersReducedMotion) {
      const t = (state.time * .095 + index * .17) % 1;
      const p = quadPoint(q, t);
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(16,19,20,.94)';
      ctx.shadowBlur = 12;
      ctx.shadowColor = 'rgba(16,19,20,.28)';
      ctx.fill();
    }
    ctx.restore();
  }

  function drawNode(node) {
    const p = project(node);
    const isFocus = !state.focus || state.focus === node.id;
    const primary = ['fovea', 'p360', 'pacn', 'nodes'].includes(node.id);

    ctx.save();

    if (primary) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, node.r * 3.2, 0, Math.PI * 2);
      ctx.strokeStyle = isFocus ? 'rgba(16,19,20,.28)' : 'rgba(16,19,20,.07)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(p.x, p.y, node.r, 0, Math.PI * 2);
    ctx.fillStyle = isFocus ? 'rgba(16,19,20,.98)' : 'rgba(16,19,20,.28)';
    ctx.fill();

    if (primary) {
      ctx.font = '500 11px "Space Grotesk", sans-serif';
      ctx.letterSpacing = '1px';
      ctx.fillStyle = isFocus ? 'rgba(16,19,20,.78)' : 'rgba(16,19,20,.28)';
      ctx.fillText(node.label, p.x + 18, p.y - 14);
    }

    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, state.width, state.height);
    state.mouseX += (state.targetMouseX - state.mouseX) * .04;
    state.mouseY += (state.targetMouseY - state.mouseY) * .04;

    drawPerspectiveGrid();

    const hub = project(nodes[0]);
    ctx.save();
    ctx.strokeStyle = 'rgba(16,19,20,.08)';
    ctx.lineWidth = 1;
    [82, 152, 236].forEach((radius, i) => {
      ctx.beginPath();
      ctx.arc(hub.x, hub.y, radius + Math.sin(state.time * .55 + i) * 3, 0, Math.PI * 2);
      ctx.stroke();
    });
    ctx.beginPath();
    ctx.moveTo(hub.x - 270, hub.y);
    ctx.lineTo(hub.x + 270, hub.y);
    ctx.moveTo(hub.x, hub.y - 270);
    ctx.lineTo(hub.x, hub.y + 270);
    ctx.strokeStyle = 'rgba(16,19,20,.045)';
    ctx.stroke();
    ctx.restore();

    links.forEach(([from, to], index) => {
      const a = nodes.find(node => node.id === from);
      const b = nodes.find(node => node.id === to);
      if (a && b) drawLink(a, b, index);
    });

    nodes.forEach(drawNode);

    if (!prefersReducedMotion) {
      state.time += .016;
      requestAnimationFrame(draw);
    }
  }

  canvas.addEventListener('pointermove', event => {
    const bounds = canvas.getBoundingClientRect();
    state.targetMouseX = ((event.clientX - bounds.left) / bounds.width - .5) * 2;
    state.targetMouseY = ((event.clientY - bounds.top) / bounds.height - .5) * 2;
  });

  canvas.addEventListener('pointerleave', () => {
    state.targetMouseX = 0;
    state.targetMouseY = 0;
  });

  document.querySelectorAll('[data-route-focus]').forEach(row => {
    row.addEventListener('mouseenter', () => {
      state.focus = row.dataset.routeFocus || null;
      if (prefersReducedMotion) draw();
    });
    row.addEventListener('mouseleave', () => {
      state.focus = null;
      if (prefersReducedMotion) draw();
    });
  });

  window.addEventListener('resize', () => {
    resize();
    if (prefersReducedMotion) draw();
  });

  resize();
  draw();
}

initReveal();
initRoutingCanvas();
