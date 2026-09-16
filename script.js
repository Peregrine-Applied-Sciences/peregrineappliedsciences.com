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

// Mark the current top-level page in the global navigation.
const currentPage = document.body.dataset.page;
if (currentPage) {
  document.querySelectorAll(`[data-nav="${currentPage}"]`).forEach(link => {
    link.classList.add('active');
    link.setAttribute('aria-current', 'page');
  });
}

// Keep the copyright year current without maintaining it in every page.
document.querySelectorAll('[data-year]').forEach(el => {
  el.textContent = String(new Date().getFullYear());
});

// Lightweight inertial parallax for hero imagery; no external dependencies.
let targetY = window.scrollY;
let currentY = targetY;
function animateParallax() {
  targetY = window.scrollY;
  currentY += (targetY - currentY) * 0.08;
  document.documentElement.style.setProperty('--scrollY', `${currentY}px`);
  requestAnimationFrame(animateParallax);
}
requestAnimationFrame(animateParallax);

// Close the mobile menu when the viewport returns to desktop width.
window.addEventListener('resize', () => {
  if (window.innerWidth > 880) {
    nav?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  }
});