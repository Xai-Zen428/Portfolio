// Website enquiries go to this WhatsApp number in international format, digits only.
const WHATSAPP_NUMBER = '27706913854';

(() => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  if (toggle && links) {
    const closeMenu = () => {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation');
      links.classList.remove('is-open');
    };

    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
      links.classList.toggle('is-open', !isOpen);
    });

    links.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  const year = document.querySelector('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          activeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const pricingTabs = Array.from(document.querySelectorAll('[data-pricing-tab]'));
  const pricingPanels = new Map(
    pricingTabs.map((tab) => [tab.dataset.pricingTab, document.getElementById(tab.getAttribute('aria-controls'))])
  );

  const activatePricingTab = (selectedTab, moveFocus = false) => {
    pricingTabs.forEach((tab) => {
      const selected = tab === selectedTab;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      tab.classList.toggle('is-active', selected);
      const panel = pricingPanels.get(tab.dataset.pricingTab);
      if (!panel) return;
      panel.hidden = !selected;
      if (selected) {
        panel.classList.remove('is-visible');
        requestAnimationFrame(() => panel.classList.add('is-visible'));
      }
    });
    if (moveFocus) selectedTab.focus();
  };

  pricingTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activatePricingTab(tab));
    tab.addEventListener('keydown', (event) => {
      let nextIndex;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % pricingTabs.length;
      if (event.key === 'ArrowLeft') nextIndex = (index - 1 + pricingTabs.length) % pricingTabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = pricingTabs.length - 1;
      if (nextIndex !== undefined) {
        event.preventDefault();
        activatePricingTab(pricingTabs[nextIndex], true);
      }
    });
  });

  const enquiryForm = document.querySelector('#website-enquiry-form');
  const enquiryFeedback = document.querySelector('#enquiry-feedback');
  const paymentOptionSelect = document.querySelector('#enquiry-payment-option');
  const packageSelect = document.querySelector('#enquiry-budget');

  if (enquiryForm && enquiryFeedback && paymentOptionSelect && packageSelect) {
    const requiredFields = Array.from(enquiryForm.querySelectorAll('[required]'));
    const packageOptions = {
      'once-off': [
        { value: 'basic', name: 'Basic', price: 'R3,500 once-off' },
        { value: 'business', name: 'Business', price: 'R5,500 once-off' },
        { value: 'premium', name: 'Premium', price: 'R8,000 once-off' }
      ],
      monthly: [
        { value: 'basic', name: 'Basic', price: 'R4,000/month' },
        { value: 'business', name: 'Business', price: 'R5,500/month' },
        { value: 'premium', name: 'Premium', price: 'R7,000/month' }
      ]
    };

    const addPackageOption = (value, label, name = '', price = '') => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = label;
      option.dataset.package = name;
      option.dataset.price = price;
      packageSelect.append(option);
      return option;
    };

    const updatePackageOptions = () => {
      packageSelect.replaceChildren();
      const paymentOption = paymentOptionSelect.value;

      if (!paymentOption) {
        addPackageOption('', 'Choose a payment option first');
        packageSelect.disabled = true;
        return;
      }

      packageSelect.disabled = false;
      if (paymentOption === 'advice') {
        addPackageOption('advice', 'Not sure — I need advice', 'Not sure — I need advice', 'To be discussed');
        packageSelect.value = 'advice';
        return;
      }

      addPackageOption('', 'Choose a package');
      packageOptions[paymentOption].forEach((item) => {
        addPackageOption(item.value, `${item.name} — ${item.price}`, item.name, item.price);
      });
    };

    paymentOptionSelect.addEventListener('change', updatePackageOptions);
    updatePackageOptions();

    document.querySelectorAll('.price-link[data-payment-option]').forEach((link) => {
      link.addEventListener('click', () => {
        paymentOptionSelect.value = link.dataset.paymentOption;
        updatePackageOptions();
        packageSelect.value = link.dataset.package;
      });
    });

    requiredFields.forEach((field) => {
      field.addEventListener('input', () => {
        if (field.value.trim()) field.removeAttribute('aria-invalid');
      });
      field.addEventListener('change', () => {
        if (field.value.trim()) field.removeAttribute('aria-invalid');
      });
    });

    enquiryForm.addEventListener('submit', (event) => {
      event.preventDefault();
      enquiryFeedback.textContent = '';

      const firstMissing = requiredFields.find((field) => !field.value.trim());
      if (firstMissing) {
        requiredFields.forEach((field) => {
          if (!field.value.trim()) field.setAttribute('aria-invalid', 'true');
        });
        enquiryFeedback.textContent = 'Please complete the required fields so I have what I need to get back to you.';
        firstMissing.focus();
        return;
      }

      const phoneNumber = WHATSAPP_NUMBER.replace(/\D/g, '');
      if (!/^\d{8,15}$/.test(phoneNumber)) {
        enquiryFeedback.textContent = 'The WhatsApp number needs to be set in the WHATSAPP_NUMBER constant before enquiries can be opened.';
        return;
      }

      const formData = new FormData(enquiryForm);
      const paymentOption = formData.get('paymentOption');
      const selectedPackage = packageSelect.selectedOptions[0];
      const paymentLabels = { 'once-off': 'Once-off', monthly: 'Monthly', advice: 'Not sure — I need advice' };
      const packageName = selectedPackage.dataset.package || 'Not sure — I need advice';
      const packagePrice = selectedPackage.dataset.price || 'To be discussed';
      const pricingDetails = [
        `Payment option: ${paymentLabels[paymentOption]}`,
        `Package: ${packageName}`,
        `Price: ${packagePrice}`
      ];

      const message = [
        'New Website Enquiry',
        '',
        `Name: ${formData.get('name').trim()}`,
        `Business: ${formData.get('business').trim()}`,
        `WhatsApp/Phone: ${formData.get('phone').trim()}`,
        `Website Type: ${formData.get('websiteType').trim()}`,
        ...pricingDetails,
        '',
        'Project Details:',
        formData.get('details').trim()
      ].join('\n');

      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  }
})();
