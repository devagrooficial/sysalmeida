// Header: reforça o vidro ao rolar
const header = document.getElementById('header');
const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 20);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Mockup 3D: inclinação suave seguindo o mouse
const mock = document.getElementById('mock');
const visual = mock && mock.closest('.hero__visual');
const canTilt = window.matchMedia('(hover: hover)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (visual && canTilt) {
  visual.addEventListener('mousemove', (e) => {
    const r = visual.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    mock.style.setProperty('--ry', `${x * 8}deg`);
    mock.style.setProperty('--rx', `${14 - y * 6}deg`);
  });
  visual.addEventListener('mouseleave', () => {
    mock.style.removeProperty('--ry');
    mock.style.removeProperty('--rx');
  });
}

// Reveal ao rolar
const revealEls = document.querySelectorAll('.reveal-s');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('in'));
}

// Spotlight do cursor nos cards
document.querySelectorAll('.spot').forEach((card) => {
  card.addEventListener('pointermove', (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
});

// Malha de pontos conectados (seção Empresa)
(function mesh() {
  const canvas = document.getElementById('mesh');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w, h, pts, raf, visible = false;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = w < 400 ? 42 : 64;
    pts = Array.from({ length: n }, () => {
      // distribuição dentro de um círculo
      const a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()) * 0.46;
      return { x: w / 2 + Math.cos(a) * r * w, y: h / 2 + Math.sin(a) * r * h,
               vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25, s: Math.random() * 1.6 + 0.8 };
    });
  };

  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    const link = w * 0.2, cx = w / 2, cy = h / 2, R = w * 0.48;
    for (const p of pts) {
      if (!reduce) { p.x += p.vx; p.y += p.vy; }
      const dx = p.x - cx, dy = p.y - cy;
      if (dx * dx + dy * dy > R * R) { p.vx *= -1; p.vy *= -1; }
    }
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
        if (d < link) {
          ctx.strokeStyle = `rgba(16,229,160,${(1 - d / link) * 0.35})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
        }
      }
    }
    for (const p of pts) {
      ctx.shadowColor = '#10e5a0'; ctx.shadowBlur = 12; ctx.fillStyle = '#7dffd3';
      ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2); ctx.fill();
    }
    ctx.shadowBlur = 0;
    if (visible && !reduce) raf = requestAnimationFrame(draw);
  };

  resize(); draw();
  window.addEventListener('resize', () => { resize(); draw(); });
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    cancelAnimationFrame(raf);
    if (visible) draw();
  }).observe(canvas);
})();
