const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

menuButton?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.site-nav a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});

// Live-feeling coordinate micro-animation
const coordA = document.getElementById('coord-a');
const coordB = document.getElementById('coord-b');
let t = 0;
setInterval(() => {
  t += 0.017;
  if (coordA) coordA.textContent = `${(31.7619 + Math.sin(t) * 0.0018).toFixed(4)}°N`;
  if (coordB) coordB.textContent = `${(106.4850 + Math.cos(t * .8) * 0.0018).toFixed(4)}°W`;
}, 900);

// Unit toggle
const unitToggle = document.getElementById('unitToggle');
let metric = false;
unitToggle?.addEventListener('click', () => {
  metric = !metric;
  document.querySelectorAll('[data-imperial][data-metric]').forEach(el => {
    el.textContent = metric ? el.dataset.metric : el.dataset.imperial;
  });
  unitToggle.textContent = metric ? 'UNITS: METRIC' : 'UNITS: IMPERIAL';
});

// Lightweight parallax / inertial feel without external dependencies
let targetY = window.scrollY;
let currentY = targetY;
function animateParallax(){
  targetY = window.scrollY;
  currentY += (targetY - currentY) * 0.08;
  document.documentElement.style.setProperty('--scrollY', `${currentY}px`);
  requestAnimationFrame(animateParallax);
}
requestAnimationFrame(animateParallax);
