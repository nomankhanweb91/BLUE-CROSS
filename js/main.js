/**
 * BLUE CROSS — Main UI & Navigation Interactions
 * Pure Vanilla JavaScript | Zero Frameworks
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNavigation();
  initFaqAccordions();
  initGalleryLightbox();
  highlightActiveNavLink();
  initVisitorCounter();
});

function initVisitorCounter() {
  const BASELINE = 18490;
  let count = parseInt(localStorage.getItem('blue_cross_visitors') || '0', 10);
  if (!count || count < BASELINE) {
    count = BASELINE + Math.floor(Math.random() * 5) + 1;
  } else {
    count += 1;
  }
  localStorage.setItem('blue_cross_visitors', count.toString());

  const formatted = count.toLocaleString('en-IN');
  document.querySelectorAll('.footer-visitor-count').forEach(el => {
    el.textContent = `${formatted}+`;
  });
}


function initMobileNavigation() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const navMenu = document.getElementById('mainNavMenu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      toggleBtn.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('open');
      toggleBtn.innerHTML = isExpanded ? '☰' : '✕';
    });

    // Close when clicking nav link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.innerHTML = '☰';
      });
    });
  }
}

function highlightActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

function initFaqAccordions() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        // Close others
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isOpen) {
          item.classList.add('active');
        }
      });
    }
  });
}

function initGalleryLightbox() {
  const lightbox = document.getElementById('galleryLightbox');
  if (!lightbox) return;

  const closeBtn = document.getElementById('lightboxCloseBtn');
  const mediaContainer = document.getElementById('lightboxMedia');
  const titleEl = document.getElementById('lightboxTitle');
  const tagEl = document.getElementById('lightboxTag');

  document.querySelectorAll('[data-lightbox-item]').forEach(item => {
    item.addEventListener('click', () => {
      const title = item.getAttribute('data-title') || 'Gallery Photo';
      const tag = item.getAttribute('data-tag') || 'BLUE CROSS';
      const imgSrc = item.getAttribute('data-img');
      const icon = item.getAttribute('data-icon') || '📸';

      if (titleEl) titleEl.textContent = title;
      if (tagEl) tagEl.textContent = tag;
      if (mediaContainer) {
        if (imgSrc) {
          mediaContainer.innerHTML = `
            <div style="text-align: center; padding: 16px;">
              <img src="${imgSrc}" alt="${title}" style="max-width: 100%; max-height: 420px; border-radius: 12px; object-fit: contain; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
              <div style="font-size: 1rem; color: #5F7180; margin-top: 14px; font-weight: 500;">
                ${title}
              </div>
            </div>
          `;
        } else {
          mediaContainer.innerHTML = `
            <div style="font-size: 5rem; text-align: center; padding: 40px; color: #1688E8;">
              ${icon}
              <div style="font-size: 1.1rem; color: #5F7180; margin-top: 10px; font-weight: normal;">
                ${title}
              </div>
            </div>
          `;
        }
      }

      lightbox.classList.add('active');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      lightbox.classList.remove('active');
    });
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
    }
  });
}
