const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#site-nav');
const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('#site-nav a')];
const animatedGroups = [
  ['.programme-grid .programme-card', 'stagger'],
  ['.why-grid .why-card', 'stagger'],
  ['.gallery-grid .gallery-placeholder', 'stagger'],
  ['.admissions-cards article', 'stagger']
];

const aboutSection = document.querySelector('#about');
if (aboutSection && !document.querySelector('.quick-facts')) {
  aboutSection.insertAdjacentHTML('beforebegin', '<section class="quick-facts" aria-label="Quick facts"><div class="container quick-facts-list"><div class="quick-fact fact-blue"><span aria-hidden="true">&#x1F476;</span><strong>3 Months – Grade R</strong></div><div class="quick-fact fact-pink"><span aria-hidden="true">&#x1F4DA;</span><strong>English</strong></div><div class="quick-fact fact-yellow"><span aria-hidden="true">&#x1F561;</span><strong>06:30 – 17:15</strong></div><div class="quick-fact fact-purple"><span aria-hidden="true">&#x1F4C5;</span><strong>Monday – Friday</strong></div></div></section>');
}
if (aboutSection && !document.querySelector('.explore-journey')) {
  aboutSection.insertAdjacentHTML('beforebegin', '<section class="explore-journey section" aria-labelledby="explore-title"><div class="container"><div class="explore-heading"><p class="eyebrow">Your Little Kidzone journey</p><h2 id="explore-title">Explore Little Kidzone &#x1F308;</h2><p>Take a little tour through our school, classes, community and contact details.</p></div><div class="journey-list"><a class="journey-link" href="#home" data-journey-target="home"><span class="journey-icon">&#x1F44B;</span><strong>Meet LKZ</strong><small>Start here</small></a><a class="journey-link" href="#about" data-journey-target="about"><span class="journey-icon">&#x1F3E1;</span><strong>About Our School</strong><small>Our purpose</small></a><a class="journey-link" href="#programmes" data-journey-target="programmes"><span class="journey-icon">&#x1F3A8;</span><strong>Explore Our Classes</strong><small>Find your class</small></a><a class="journey-link" href="#gallery" data-journey-target="gallery"><span class="journey-icon">&#x1F4F8;</span><strong>Life at LKZ</strong><small>See our moments</small></a><a class="journey-link" href="#reviews" data-journey-target="reviews"><span class="journey-icon">&#x2764;&#xFE0F;</span><strong>What Parents Say</strong><small>Read reviews</small></a><a class="journey-link" href="#contact" data-journey-target="contact"><span class="journey-icon">&#x1F4CD;</span><strong>Come Visit Us</strong><small>Find us</small></a></div></div></section>');
}

const gallerySection = document.querySelector('#gallery');
const firstProgramme = document.querySelector('.programme-card');
if (firstProgramme) {
  firstProgramme.querySelector('.class-heading h3').textContent = 'Little Ladybugs';
  firstProgramme.querySelector('.class-logo').alt = 'Little Ladybugs class logo';
}
const babiesOption = document.querySelector('#programme-interest option');
if (babiesOption?.nextElementSibling) babiesOption.nextElementSibling.textContent = 'Little Ladybugs (LS) — 3 months–1 year';
const mapPlaceholder = document.querySelector('.map-placeholder');
if (mapPlaceholder) {
  const directionsLink = mapPlaceholder.querySelector('a');
  mapPlaceholder.innerHTML = '<div class="map-embed"><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3591.271763771367!2d28.7374212!3d-25.827588799999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1eeab24934e51163%3A0x1bd1a3fc5304269e!2sLittle%20Kidzone%20Academy!5e0!3m2!1sen!2sza!4v1790324091714!5m2!1sen!2sza" width="400" height="300" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" title="Little Kidzone Academy location map"></iframe></div>';
  mapPlaceholder.append(directionsLink);
}
const birthdayPhotos = ['BD/IMG-20260924-WA0121.jpg','BD/IMG-20260924-WA0122.jpg','BD/IMG-20260924-WA0123.jpg','BD/IMG-20260924-WA0126.jpg','BD/IMG-20260924-WA0130.jpg'];
if (gallerySection && !document.querySelector('#birthday-moments')) {
  const galleryGrid = gallerySection.querySelector('.gallery-grid');
  gallerySection.querySelector('.gallery-heading')?.insertAdjacentHTML('afterend', '<div class="gallery-filters" aria-label="Gallery categories"><button class="gallery-filter is-active" type="button" data-gallery-filter="all" aria-pressed="true">All</button><button class="gallery-filter" type="button" data-gallery-filter="activities" aria-pressed="false">Activities</button><button class="gallery-filter" type="button" data-gallery-filter="learning" aria-pressed="false">Learning</button><button class="gallery-filter" type="button" data-gallery-filter="play" aria-pressed="false">Play</button><button class="gallery-filter" type="button" data-gallery-filter="birthdays" aria-pressed="false">Birthdays 🎂</button></div>');
  galleryGrid?.querySelectorAll('.gallery-tile').forEach((tile, index) => tile.dataset.galleryCategory = ['activities','play','learning','play','activities','learning','play'][index] || 'activities');
  galleryGrid?.insertAdjacentHTML('afterend', `<section class="birthday-moments" id="birthday-moments" aria-labelledby="birthday-title"><div class="birthday-heading"><p class="eyebrow">Celebration at Little Kidzone</p><h3 id="birthday-title">Birthday Moments 🎂</h3><p>Celebrating the special moments that make childhood so memorable.</p></div><div class="birthday-grid">${birthdayPhotos.map(photo => `<button class="gallery-tile birthday-tile" type="button" data-lightbox="${photo}" data-gallery-category="birthdays" data-alt="Birthday moment at Little Kidzone Academy"><img src="${photo}" alt="Birthday moment at Little Kidzone Academy" loading="lazy"></button>`).join('')}</div></section>`);
  gallerySection.querySelectorAll('.gallery-tile img').forEach(image => { image.loading = 'lazy'; });
  gallerySection.querySelectorAll('.gallery-filter').forEach(filter => filter.addEventListener('click', () => {
    const category = filter.dataset.galleryFilter;
    gallerySection.querySelectorAll('.gallery-filter').forEach(button => { const active = button === filter; button.classList.toggle('is-active', active); button.setAttribute('aria-pressed', String(active)); });
    gallerySection.querySelectorAll('.gallery-tile').forEach(tile => { tile.hidden = category !== 'all' && tile.dataset.galleryCategory !== category; });
    gallerySection.querySelector('#birthday-moments').hidden = category !== 'all' && category !== 'birthdays';
  }));
}

menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  navigation.classList.toggle('is-open', !isOpen);
});

navigation.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
  });
});

const revealElements = document.querySelectorAll(
  '.hero-copy, .hero-illustration, .about-art, .about-copy, .section-intro, .why-heading, .why-photo, .why-cta, .gallery-heading, .contact-copy, .contact-form, .day-heading, .day-event'
);
revealElements.forEach((element) => element.classList.add('reveal-on-scroll'));
animatedGroups.forEach(([selector, className]) => {
  document.querySelectorAll(selector).forEach((element, index) => {
    element.classList.add('reveal-on-scroll', className);
    element.style.setProperty('--reveal-delay', `${index * 90}ms`);
  });
});

const observer = new IntersectionObserver((entries, currentObserver) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    currentObserver.unobserve(entry.target);
  });
}, { threshold: 0.14, rootMargin: '0px 0px -45px' });

document.querySelectorAll('.reveal-on-scroll').forEach((element) => observer.observe(element));

const activeSectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });

sections.forEach((section) => activeSectionObserver.observe(section));

const journeyLinks = [...document.querySelectorAll('.journey-link')];
const journeyObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    journeyLinks.forEach((link) => link.classList.toggle('is-active', link.dataset.journeyTarget === entry.target.id));
  });
}, { rootMargin: '-38% 0px -52% 0px', threshold: 0 });
journeyLinks.forEach((link) => {
  const target = document.querySelector(`#${link.dataset.journeyTarget}`);
  if (target) journeyObserver.observe(target);
});

document.querySelector('#year').textContent = new Date().getFullYear();

const reviewTrack = document.querySelector('.review-track');
const reviewCards = [...document.querySelectorAll('.review-card')];
const reviewDots = [...document.querySelectorAll('.review-dot')];
const previousReview = document.querySelector('.review-prev');
const nextReview = document.querySelector('.review-next');
let activeReview = 0;

const showReview = (index) => {
  activeReview = (index + reviewCards.length) % reviewCards.length;
  reviewTrack.style.transform = `translateX(-${activeReview * 100}%)`;
  reviewDots.forEach((dot, dotIndex) => {
    const isActive = dotIndex === activeReview;
    dot.classList.toggle('is-active', isActive);
    dot.setAttribute('aria-selected', String(isActive));
  });
};

previousReview.addEventListener('click', () => showReview(activeReview - 1));
nextReview.addEventListener('click', () => showReview(activeReview + 1));
reviewDots.forEach((dot, index) => dot.addEventListener('click', () => showReview(index)));

document.querySelector('[data-google-reviews-placeholder]').addEventListener('click', (event) => {
  event.preventDefault();
  window.alert('The Google Reviews link will be added when the school provides it.');
});

const galleryTiles = [...document.querySelectorAll('[data-lightbox]')];
const lightbox = document.querySelector('#lightbox');
const lightboxImage = document.querySelector('#lightbox-image');
const lightboxCaption = document.querySelector('#lightbox-caption');
let activePhoto = 0;
let touchStartX = 0;
let lightboxOpener = null;

const showPhoto = (index) => {
  activePhoto = (index + galleryTiles.length) % galleryTiles.length;
  const tile = galleryTiles[activePhoto];
  lightboxImage.src = tile.dataset.lightbox;
  lightboxImage.alt = tile.dataset.alt;
  lightboxCaption.textContent = tile.dataset.alt;
};

const closeLightbox = () => {
  lightbox.hidden = true;
  document.body.classList.remove('lightbox-open');
  document.querySelectorAll('header, main, footer').forEach((element) => { element.inert = false; });
  lightboxOpener?.focus();
};

galleryTiles.forEach((tile, index) => tile.addEventListener('click', () => {
  lightboxOpener = tile;
  showPhoto(index);
  lightbox.hidden = false;
  document.body.classList.add('lightbox-open');
  document.querySelectorAll('header, main, footer').forEach((element) => { element.inert = true; });
  lightbox.querySelector('.lightbox-close').focus();
}));

lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
lightbox.querySelector('.lightbox-prev').addEventListener('click', () => showPhoto(activePhoto - 1));
lightbox.querySelector('.lightbox-next').addEventListener('click', () => showPhoto(activePhoto + 1));
lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
lightbox.addEventListener('touchstart', (event) => { touchStartX = event.changedTouches[0].screenX; }, { passive: true });
lightbox.addEventListener('touchend', (event) => { const distance = event.changedTouches[0].screenX - touchStartX; if (Math.abs(distance) < 45) return; showPhoto(distance > 0 ? activePhoto - 1 : activePhoto + 1); }, { passive: true });
document.addEventListener('keydown', (event) => {
  if (lightbox.hidden) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(activePhoto - 1); }
  if (event.key === 'ArrowRight') { event.preventDefault(); showPhoto(activePhoto + 1); }
  if (event.key === 'Tab') {
    const focusable = [...lightbox.querySelectorAll('button:not([disabled])')];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});

const enquiryForm = document.querySelector('#enquiry-form');
const whatsappNumber = '27721352180';

const setFieldError = (fieldId, message) => {
  const field = document.querySelector(`#${fieldId}`);
  const error = document.querySelector(`[data-error-for="${fieldId}"]`);
  field.classList.toggle('has-error', Boolean(message));
  field.setAttribute('aria-invalid', String(Boolean(message)));
  error.textContent = message;
  return Boolean(message);
};

enquiryForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const parentName = document.querySelector('#parent-name').value.trim();
  const phone = document.querySelector('#parent-phone').value.trim();
  const email = document.querySelector('#parent-email').value.trim();
  const childAge = document.querySelector('#child-age').value.trim();
  const programme = document.querySelector('#programme-interest').value;
  const message = document.querySelector('#enquiry-message').value.trim();
  let hasErrors = false;

  hasErrors = setFieldError('parent-name', parentName ? '' : 'Please enter your name.') || hasErrors;
  hasErrors = setFieldError('parent-phone', phone ? '' : 'Please enter a phone number.') || hasErrors;
  hasErrors = setFieldError('parent-email', !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'Please enter a valid email address.') || hasErrors;
  hasErrors = setFieldError('child-age', childAge ? '' : "Please enter your child's age.") || hasErrors;
  hasErrors = setFieldError('programme-interest', programme ? '' : 'Please choose a programme.') || hasErrors;
  hasErrors = setFieldError('enquiry-message', message ? '' : 'Please enter a message.') || hasErrors;
  if (hasErrors) return;

  const whatsappMessage = [
    'Hello Little Kidzone Academy, I would like to make an enquiry.',
    '',
    `Parent/Guardian Name: ${parentName}`,
    `Phone Number: ${phone}`,
    `Email Address: ${email || 'Not provided'}`,
    `Child's Age: ${childAge}`,
    `Programme Interested In: ${programme}`,
    '',
    `Message: ${message}`
  ].join('\n');
  document.querySelector('#form-status').textContent = 'Opening WhatsApp…';
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`, '_blank', 'noopener,noreferrer');
});
