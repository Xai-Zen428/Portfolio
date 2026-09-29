const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const prefersReducedMotion = () => motionPreference.matches;

const revealSections = Array.from(document.querySelectorAll('main > section:not(.hero)'));
if (!prefersReducedMotion() && 'IntersectionObserver' in window) {
  revealSections.forEach((section) => section.setAttribute('data-scroll-reveal', ''));
  document.body.classList.add('has-scroll-reveals');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in-view');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -7% 0px' });

  revealSections.forEach((section) => revealObserver.observe(section));
}

const navContainer = document.querySelector('.nav-links');
const navAnchors = Array.from(navContainer.querySelectorAll('a[href^="#"]'));
const navTargets = navAnchors
  .map((link) => ({ link, section: document.querySelector(link.getAttribute('href')) }))
  .filter((item) => item.section);

function activateNavTarget(section) {
  navTargets.forEach(({ link, section: target }) => {
    const active = section === target;
    link.classList.toggle('is-active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}

navAnchors.forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;

    event.preventDefault();
    if (window.location.hash !== link.getAttribute('href')) {
      try {
        window.history.pushState(null, '', link.getAttribute('href'));
      } catch {
        window.location.hash = link.getAttribute('href');
      }
    }
    target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
    activateNavTarget(target);
  });
});

window.addEventListener('hashchange', () => {
  const target = document.querySelector(window.location.hash);
  if (target) activateNavTarget(target);
});

if ('IntersectionObserver' in window && navTargets.length) {
  const visibleNavSections = new Set();
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) visibleNavSections.add(entry.target);
      else visibleNavSections.delete(entry.target);
    });

    const viewportCenter = window.innerHeight / 2;
    const currentSection = Array.from(visibleNavSections).sort((first, second) => {
      const firstCenter = first.getBoundingClientRect().top + first.getBoundingClientRect().height / 2;
      const secondCenter = second.getBoundingClientRect().top + second.getBoundingClientRect().height / 2;
      return Math.abs(firstCenter - viewportCenter) - Math.abs(secondCenter - viewportCenter);
    })[0];

    activateNavTarget(currentSection || null);
  }, { threshold: 0, rootMargin: '-34% 0px -56% 0px' });

  navTargets.forEach(({ section }) => navObserver.observe(section));
}

const backToTop = document.createElement('button');
backToTop.className = 'back-to-top';
backToTop.type = 'button';
backToTop.setAttribute('aria-label', 'Back to top');
backToTop.setAttribute('aria-hidden', 'true');
backToTop.tabIndex = -1;
backToTop.textContent = '↑';
document.body.append(backToTop);

let scrollFrame = null;
function updateBackToTop() {
  scrollFrame = null;
  const visible = window.scrollY > 420;
  backToTop.classList.toggle('is-visible', visible);
  backToTop.setAttribute('aria-hidden', String(!visible));
  backToTop.tabIndex = visible ? 0 : -1;
}

window.addEventListener('scroll', () => {
  if (scrollFrame !== null) return;
  scrollFrame = window.requestAnimationFrame(updateBackToTop);
}, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  document.querySelector('.brand').focus({ preventScroll: true });
});

updateBackToTop();
