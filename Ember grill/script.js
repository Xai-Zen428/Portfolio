const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

function closeMenu() {
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Open navigation');
  navLinks.classList.remove('open');
}

navToggle.addEventListener('click', () => {
  const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  navLinks.classList.toggle('open', !isOpen);
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

const hero = document.querySelector('.hero');
const heroImage = document.querySelector('.hero-image-layer');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let parallaxFrame = null;

function moveHeroBackground() {
  parallaxFrame = null;
  if (!hero || !heroImage || reduceMotion.matches || window.innerWidth <= 620) return;

  const bounds = hero.getBoundingClientRect();
  if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) return;

  const progress = (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height);
  heroImage.style.transform = `translate3d(0, ${((progress - 0.5) * -22).toFixed(1)}px, 0)`;
}

window.addEventListener('scroll', () => {
  if (parallaxFrame === null) parallaxFrame = window.requestAnimationFrame(moveHeroBackground);
}, { passive: true });
window.addEventListener('resize', () => {
  if (parallaxFrame === null) parallaxFrame = window.requestAnimationFrame(moveHeroBackground);
}, { passive: true });
reduceMotion.addEventListener?.('change', moveHeroBackground);

const menuTabs = document.querySelectorAll('.menu-tab');
const menuCards = document.querySelectorAll('.menu-card');
let menuFilterTimer;

menuTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const category = tab.dataset.category;

    menuTabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
    });

    window.clearTimeout(menuFilterTimer);
    menuCards.forEach((card) => card.classList.add('is-leaving'));

    menuFilterTimer = window.setTimeout(() => {
      menuCards.forEach((card) => {
        const matchesCategory = card.dataset.type === category;
        card.hidden = !matchesCategory;
        card.classList.remove('is-leaving');

        if (matchesCategory) {
          card.classList.add('is-entering');
          window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => card.classList.remove('is-entering'));
          });
        }
      });
    }, 220);
  });
});

menuTabs.forEach((tab, index) => {
  tab.addEventListener('keydown', (event) => {
    const directions = { ArrowRight: 1, ArrowLeft: -1 };
    let nextIndex = index;

    if (event.key in directions) {
      nextIndex = (index + directions[event.key] + menuTabs.length) % menuTabs.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = menuTabs.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    menuTabs[nextIndex].focus();
    menuTabs[nextIndex].click();
  });
});

const reservationForm = document.querySelector('#reservation-form');
const dateInput = reservationForm.querySelector('input[name="date"]');
const reservationConfirmation = document.querySelector('#reservation-confirmation');
const reservationMessage = document.querySelector('#reservation-message');
const reservationFields = Array.from(reservationForm.querySelectorAll('[name]'));
const reservationFieldMessages = {
  name: 'Please enter your full name.',
  email: 'Enter a valid email address so this demo can show your summary.',
  phone: 'Enter a valid phone number with at least 7 digits.',
  date: 'Choose a date today or later.',
  time: 'Choose a preferred time.',
  guests: 'Choose how many guests will be joining.'
};

function localDateString(date = new Date()) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().split('T')[0];
}

dateInput.min = localDateString();

function setReservationError(field, message = '') {
  const error = document.querySelector(`#${field.name}-error`);
  const hasError = Boolean(message);
  field.setAttribute('aria-invalid', String(hasError));
  error.textContent = message;
}

function validateReservation() {
  let firstInvalidField = null;

  reservationFields.forEach((field) => {
    const value = field.value.trim();
    let message = '';

    if (!value) {
      message = reservationFieldMessages[field.name];
    } else if (field.name === 'name' && value.length < 2) {
      message = 'Please enter at least 2 characters for your name.';
    } else if (field.name === 'email' && !field.validity.valid) {
      message = reservationFieldMessages.email;
    } else if (field.name === 'phone' && (!/^[+\d\s().-]+$/.test(value) || value.replace(/\D/g, '').length < 7)) {
      message = reservationFieldMessages.phone;
    } else if (field.name === 'date' && value < localDateString()) {
      message = reservationFieldMessages.date;
    }

    setReservationError(field, message);
    if (message && !firstInvalidField) firstInvalidField = field;
  });

  if (firstInvalidField) {
    reservationMessage.textContent = 'A couple of details need your attention. Please check the highlighted fields.';
    firstInvalidField.focus();
    return false;
  }

  reservationMessage.textContent = '';
  return true;
}

reservationFields.forEach((field) => {
  field.addEventListener('input', () => setReservationError(field));
  field.addEventListener('change', () => setReservationError(field));
});

reservationForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (reservationForm.classList.contains('is-processing') || !validateReservation()) return;

  const formData = new FormData(reservationForm);
  const selectedDate = formData.get('date');
  const selectedTime = formData.get('time');
  const selectedGuests = formData.get('guests');
  const submitButton = reservationForm.querySelector('.form-submit');
  const submitLabel = reservationForm.querySelector('.submit-label');

  reservationForm.classList.add('is-processing');
  reservationForm.setAttribute('aria-busy', 'true');
  submitButton.disabled = true;
  submitLabel.textContent = 'Preparing your preview…';
  reservationMessage.textContent = 'Putting your evening together…';

  window.setTimeout(() => {
    const [year, month, day] = selectedDate.split('-').map(Number);
    const prettyDate = new Intl.DateTimeFormat(undefined, {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    }).format(new Date(year, month - 1, day));
    const guestsLabel = Number(selectedGuests) === 1 ? '1 guest' : `${selectedGuests} guests`;

    reservationConfirmation.querySelector('[data-confirmation="date"]').textContent = prettyDate;
    reservationConfirmation.querySelector('[data-confirmation="time"]').textContent = selectedTime;
    reservationConfirmation.querySelector('[data-confirmation="guests"]').textContent = guestsLabel;
    reservationForm.classList.remove('is-processing');
    reservationForm.removeAttribute('aria-busy');
    reservationForm.hidden = true;
    reservationConfirmation.hidden = false;
    reservationConfirmation.querySelector('.make-another').focus();
  }, 850);
});

reservationConfirmation.querySelector('.make-another').addEventListener('click', () => {
  reservationForm.reset();
  reservationFields.forEach((field) => setReservationError(field));
  reservationForm.classList.remove('is-processing');
  reservationForm.removeAttribute('aria-busy');
  reservationForm.querySelector('.form-submit').disabled = false;
  reservationForm.querySelector('.submit-label').textContent = 'Request a table';
  reservationMessage.textContent = '';
  reservationConfirmation.hidden = true;
  reservationForm.hidden = false;
  reservationForm.querySelector('[name="name"]').focus();
});

const galleryLightbox = document.querySelector('#gallery-lightbox');
const galleryLightboxImage = galleryLightbox.querySelector('.lightbox-image');
const galleryLightboxCaption = galleryLightbox.querySelector('.lightbox-caption');
const galleryLightboxCount = galleryLightbox.querySelector('.lightbox-count');
const galleryCloseButton = galleryLightbox.querySelector('.lightbox-close');
const galleryImages = Array.from(document.querySelectorAll('.gallery-item img'));
let activeGalleryIndex = 0;
let galleryReturnFocus = null;
let galleryImageTimer;
let galleryCloseTimer;
let previousBodyOverflow = '';

function showGalleryImage(index) {
  activeGalleryIndex = (index + galleryImages.length) % galleryImages.length;
  const image = galleryImages[activeGalleryIndex];
  const figure = image.closest('.gallery-item');
  const caption = figure.querySelector('figcaption')?.textContent.trim() || image.alt;

  window.clearTimeout(galleryImageTimer);
  galleryLightboxImage.classList.add('is-changing');
  galleryImageTimer = window.setTimeout(() => {
    galleryLightboxImage.src = image.currentSrc || image.src;
    galleryLightboxImage.alt = image.alt;
    galleryLightboxCaption.textContent = caption;
    galleryLightboxCount.textContent = `${String(activeGalleryIndex + 1).padStart(2, '0')} / ${String(galleryImages.length).padStart(2, '0')}`;
    window.requestAnimationFrame(() => galleryLightboxImage.classList.remove('is-changing'));
  }, 140);
}

function openGallery(index, source) {
  window.clearTimeout(galleryCloseTimer);
  galleryReturnFocus = source;
  previousBodyOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  galleryLightbox.hidden = false;
  galleryLightbox.setAttribute('aria-hidden', 'false');
  galleryLightbox.classList.remove('is-closing');
  showGalleryImage(index);
  galleryCloseButton.focus();
}

function closeGallery() {
  if (galleryLightbox.hidden || galleryLightbox.classList.contains('is-closing')) return;
  galleryLightbox.classList.add('is-closing');
  galleryLightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = previousBodyOverflow;
  galleryCloseTimer = window.setTimeout(() => {
    galleryLightbox.hidden = true;
    galleryLightbox.classList.remove('is-closing');
    galleryReturnFocus?.focus();
  }, 220);
}

galleryImages.forEach((image, index) => {
  const tile = image.closest('.gallery-item');
  tile.tabIndex = 0;
  tile.setAttribute('role', 'button');
  tile.setAttribute('aria-label', `Open image: ${tile.querySelector('figcaption')?.textContent.trim() || image.alt}`);
  tile.addEventListener('click', () => openGallery(index, tile));
  tile.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openGallery(index, image);
    }
  });
});

galleryLightbox.querySelector('.lightbox-prev').addEventListener('click', () => showGalleryImage(activeGalleryIndex - 1));
galleryLightbox.querySelector('.lightbox-next').addEventListener('click', () => showGalleryImage(activeGalleryIndex + 1));
galleryCloseButton.addEventListener('click', closeGallery);
galleryLightbox.addEventListener('click', (event) => {
  if (event.target === galleryLightbox) closeGallery();
});

galleryLightbox.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    event.preventDefault();
    closeGallery();
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault();
    showGalleryImage(activeGalleryIndex - 1);
  } else if (event.key === 'ArrowRight') {
    event.preventDefault();
    showGalleryImage(activeGalleryIndex + 1);
  } else if (event.key === 'Tab') {
    const controls = Array.from(galleryLightbox.querySelectorAll('button'));
    const firstControl = controls[0];
    const lastControl = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === firstControl) {
      event.preventDefault();
      lastControl.focus();
    } else if (!event.shiftKey && document.activeElement === lastControl) {
      event.preventDefault();
      firstControl.focus();
    }
  }
});

const chefSteps = Array.from(document.querySelectorAll('.chef-step'));
const chefPanel = document.querySelector('#chef-panel');
const chefPanelKicker = chefPanel.querySelector('.chef-panel-kicker');
const chefPanelTitle = chefPanel.querySelector('.chef-panel-title');
const chefPanelCopy = chefPanel.querySelector('.chef-panel-copy');
const chefVisual = document.querySelector('.chef-visual');
const chefVisualImage = chefVisual.querySelector('.chef-visual-image');
const chefVisualCaption = chefVisual.querySelector('.chef-visual-caption');
let chefTransitionTimer;

const chefScenes = [
  {
    kicker: 'THE EXPERIENCE',
    title: 'Close to the flame.|Closer to the craft.',
    copy: 'Take your place at our eight-seat counter. Watch the kitchen work with fire, smoke and the best of the season in a relaxed, generous tasting experience.',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1200&q=85',
    alt: 'A chef’s live-fire tasting served straight from the grill',
    caption: ['AT THE COUNTER', '08 SEATS ONLY'],
    scene: 'experience'
  },
  {
    kicker: 'MAKE IT YOUR EVENING',
    title: 'A date worth|looking forward to.',
    copy: 'Choose a Thursday, Friday or Saturday evening and we’ll set the counter for you. The Chef’s Table is an intimate, shared seating with limited places each night.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85',
    alt: 'A warmly lit dining room ready for an intimate evening',
    caption: ['THURSDAY — SATURDAY', 'EVENING SEATINGS'],
    scene: 'date'
  },
  {
    kicker: 'A MENU FROM THE FIRE',
    title: 'Follow the season.|Stay for the surprise.',
    copy: 'Your menu unfolds course by course: just-picked ingredients, live-fire cooking and a few thoughtful surprises from the chef. It changes as the seasons do.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85',
    alt: 'A seasonal fire-grilled dish, finished with fresh herbs',
    caption: ['SEASON-LED COURSES', 'FIRE-FINISHED'],
    scene: 'menu'
  }
];

function selectChefStep(index, moveFocus = false) {
  const activeStep = chefSteps[index];
  const scene = chefScenes[index];
  if (!activeStep || !scene) return;

  window.clearTimeout(chefTransitionTimer);
  chefSteps.forEach((step, stepIndex) => {
    const isActive = stepIndex === index;
    step.classList.toggle('is-active', isActive);
    step.setAttribute('aria-selected', String(isActive));
    step.tabIndex = isActive ? 0 : -1;
  });
  chefPanel.setAttribute('aria-labelledby', activeStep.id);
  chefPanel.classList.add('is-changing');
  chefVisual.classList.add('is-changing');
  if (moveFocus) activeStep.focus();

  chefTransitionTimer = window.setTimeout(() => {
    const [firstLine, secondLine] = scene.title.split('|');
    chefPanelKicker.textContent = scene.kicker;
    chefPanelTitle.replaceChildren(
      document.createTextNode(firstLine + ' '),
      Object.assign(document.createElement('em'), { textContent: secondLine })
    );
    chefPanelCopy.textContent = scene.copy;
    chefVisualImage.src = scene.image;
    chefVisualImage.alt = scene.alt;
    chefVisual.dataset.scene = scene.scene;
    chefVisualCaption.querySelector('span:first-child').textContent = scene.caption[0];
    chefVisualCaption.querySelector('span:last-child').textContent = scene.caption[1];

    window.requestAnimationFrame(() => {
      chefPanel.classList.remove('is-changing');
      chefVisual.classList.remove('is-changing');
    });
  }, 180);
}

chefSteps.forEach((step, index) => {
  step.addEventListener('click', () => selectChefStep(index));
  step.addEventListener('keydown', (event) => {
    let nextIndex = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (index + 1) % chefSteps.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = (index - 1 + chefSteps.length) % chefSteps.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = chefSteps.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    selectChefStep(nextIndex, true);
  });
});
