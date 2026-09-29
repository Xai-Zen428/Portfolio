(() => {
  document.documentElement.classList.add('js-ready');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const header = document.querySelector('.site-header');
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    nav.classList.toggle('open', open);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    nav.classList.remove('open');
  }));

  const today = new Date();
  const dateInput = document.querySelector('input[name="date"]');
  dateInput.min = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const form = document.querySelector('#booking-form');
  const success = form.querySelector('.form-success');
  const serviceSelect = form.querySelector('[name="service"]');
  const barberSelect = form.querySelector('[name="barber"]');
  document.querySelectorAll('[data-service]').forEach(item => item.addEventListener('click', () => { serviceSelect.value = item.dataset.service; }));
  document.querySelectorAll('[data-barber]').forEach(item => item.addEventListener('click', () => { barberSelect.value = item.dataset.barber; }));
  document.querySelectorAll('[data-plan]').forEach(item => item.addEventListener('click', () => {
    form.querySelector('[name="message"]').value = `I'm interested in the ${item.dataset.plan} membership.`;
  }));
  form.addEventListener('submit', event => {
    event.preventDefault();
    success.hidden = true;
    if (!form.reportValidity()) return;
    const name = form.elements.name.value.trim().split(/\s+/)[0];
    success.textContent = `Thanks, ${name}! Your demo request is ready. In a live site, the team would follow up to confirm your appointment. No booking or data has been sent.`;
    success.hidden = false;
    form.reset();
    dateInput.min = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  });

  document.querySelectorAll('.filter').forEach(filter => filter.addEventListener('click', () => {
    document.querySelector('.filter.active')?.classList.remove('active');
    filter.classList.add('active');
    const category = filter.dataset.filter;
    document.querySelectorAll('.gallery-item').forEach(item => { item.hidden = category !== 'all' && item.dataset.category !== category; });
  }));

  const lightbox = document.querySelector('.lightbox');
  const lightboxText = lightbox.querySelector('p');
  const lightboxVisual = lightbox.querySelector('.lightbox-visual');
  let lastFocus;
  let lightboxTimer;
  document.querySelectorAll('.gallery-item').forEach(item => item.addEventListener('click', () => {
    lastFocus = item;
    window.clearTimeout(lightboxTimer);
    lightboxText.textContent = item.dataset.title;
    lightboxVisual.className = `lightbox-visual ${item.classList[1]}`;
    lightboxVisual.innerHTML = item.querySelector('.gallery-scene').innerHTML;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => lightbox.classList.add('is-open'));
    lightbox.querySelector('.lightbox-close').focus();
  }));
  const closeLightbox = () => {
    if (lightbox.hidden) return;
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 240;
    lightboxTimer = window.setTimeout(() => {
      lightbox.hidden = true;
      lastFocus?.focus();
    }, delay);
  };
  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !lightbox.hidden) closeLightbox(); });

  document.querySelectorAll('.booking-art, .booking-form-wrap, .contact-main, .map-illustration, .intro-strip, .gallery-filters').forEach(item => item.classList.add('reveal'));
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); }
    }), { threshold: 0.1, rootMargin: '0px 0px -3% 0px' });
    revealItems.forEach(item => observer.observe(item));
  } else revealItems.forEach(item => item.classList.add('in-view'));

  const backTop = document.querySelector('.back-top');
  const heroArt = document.querySelector('.hero-art');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const toolPointerMedia = window.matchMedia('(hover: hover) and (pointer: fine)');
  const heroTools = [...document.querySelectorAll('.hero-tool')];
  let pointerFrame = false;
  let pointerX = 0;
  let pointerY = 0;
  if (toolPointerMedia.matches && heroTools.length) {
    heroArt.addEventListener('pointermove', event => {
      if (reduceMotion.matches || pointerFrame) return;
      pointerFrame = true;
      const bounds = heroArt.getBoundingClientRect();
      pointerX = ((event.clientX - bounds.left) / bounds.width - .5) * 2;
      pointerY = ((event.clientY - bounds.top) / bounds.height - .5) * 2;
      window.requestAnimationFrame(() => {
        heroTools.forEach(tool => {
          const depth = Number(tool.dataset.depth || .4);
          tool.style.setProperty('--pointer-x', `${(-pointerX * depth * 3).toFixed(2)}px`);
          tool.style.setProperty('--pointer-y', `${(-pointerY * depth * 3).toFixed(2)}px`);
        });
        pointerFrame = false;
      });
    }, { passive: true });
    heroArt.addEventListener('pointerleave', () => {
      heroTools.forEach(tool => {
        tool.style.setProperty('--pointer-x', '0px');
        tool.style.setProperty('--pointer-y', '0px');
      });
    }, { passive: true });
  }
  let scrollFrame = false;
  window.addEventListener('scroll', () => {
    if (scrollFrame) return;
    scrollFrame = true;
    window.requestAnimationFrame(() => {
      const y = window.scrollY;
      header.classList.toggle('is-compact', y > 36);
      backTop.classList.toggle('visible', y > 500);
      if (window.innerWidth > 760 && !reduceMotion.matches) {
        const rect = heroArt.getBoundingClientRect();
        const offset = Math.max(-11, Math.min(11, (rect.top + rect.height * .5 - window.innerHeight * .5) * -.022));
        heroArt.style.setProperty('--parallax-y', `${offset}px`);
      }
      scrollFrame = false;
    });
  }, { passive: true });
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }));
})();
