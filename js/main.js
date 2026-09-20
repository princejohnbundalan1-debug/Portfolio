/**
 * 4th-Year OJT Portfolio Interactivity Script
 * Author: Prince
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. STICKY NAVBAR SCROLL & ACTIVE LINK SPY
  // --------------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section');
  const backToTopBtn = document.getElementById('back-to-top-btn');

  const handleScroll = () => {
    const scrollPosition = window.scrollY;

    // Sticky navbar shadow effect
    if (scrollPosition > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Show/hide back to top button
    if (scrollPosition > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }

    // Active Section Spy
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  // Smooth scroll back to top
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --------------------------------------------------------------------------
  // 2. MOBILE NAVIGATION DRAWER
  // --------------------------------------------------------------------------
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-links');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const expanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
      hamburgerBtn.setAttribute('aria-expanded', !expanded);
    });

    // Close menu when a link is clicked
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // --------------------------------------------------------------------------
  // 3. DYNAMIC COLOR PALETTE SWITCHER (:root VARIABLES)
  // --------------------------------------------------------------------------
  const paletteBtn = document.getElementById('theme-palette-btn');
  const colorDropdown = document.getElementById('color-dropdown');
  const swatches = document.querySelectorAll('.swatch-btn');

  // Palette color definitions with matching hover & light variants
  const colorSchemes = {
    '#4361ee': {
      hover: '#324edc',
      light: 'rgba(67, 97, 238, 0.14)',
      glow: 'rgba(67, 97, 238, 0.35)',
      border: 'rgba(67, 97, 238, 0.6)'
    },
    '#2a9d8f': {
      hover: '#21867a',
      light: 'rgba(42, 157, 143, 0.14)',
      glow: 'rgba(42, 157, 143, 0.35)',
      border: 'rgba(42, 157, 143, 0.6)'
    },
    '#e63946': {
      hover: '#c92a36',
      light: 'rgba(230, 57, 70, 0.14)',
      glow: 'rgba(230, 57, 70, 0.35)',
      border: 'rgba(230, 57, 70, 0.6)'
    },
    '#10b981': {
      hover: '#059669',
      light: 'rgba(16, 185, 129, 0.14)',
      glow: 'rgba(16, 185, 129, 0.35)',
      border: 'rgba(16, 185, 129, 0.6)'
    },
    '#f59e0b': {
      hover: '#d97706',
      light: 'rgba(245, 158, 11, 0.14)',
      glow: 'rgba(245, 158, 11, 0.35)',
      border: 'rgba(245, 158, 11, 0.6)'
    },
    '#8b5cf6': {
      hover: '#7c3aed',
      light: 'rgba(139, 92, 246, 0.14)',
      glow: 'rgba(139, 92, 246, 0.35)',
      border: 'rgba(139, 92, 246, 0.6)'
    }
  };

  const applyPrimaryColor = (colorHex) => {
    const root = document.documentElement;
    const scheme = colorSchemes[colorHex] || {
      hover: colorHex,
      light: 'rgba(67, 97, 238, 0.14)',
      glow: 'rgba(67, 97, 238, 0.35)',
      border: 'rgba(67, 97, 238, 0.6)'
    };

    root.style.setProperty('--primary-color', colorHex);
    root.style.setProperty('--primary-hover', scheme.hover);
    root.style.setProperty('--primary-light', scheme.light);
    root.style.setProperty('--primary-glow', scheme.glow);
    root.style.setProperty('--border-focus', scheme.border);

    // Save to local storage
    localStorage.setItem('prince_portfolio_theme_color', colorHex);

    // Update active swatch state
    swatches.forEach((swatch) => {
      if (swatch.dataset.color === colorHex) {
        swatch.classList.add('active');
      } else {
        swatch.classList.remove('active');
      }
    });
  };

  // Check saved theme color on page load
  const savedColor = localStorage.getItem('prince_portfolio_theme_color');
  if (savedColor && colorSchemes[savedColor]) {
    applyPrimaryColor(savedColor);
  }

  // Toggle dropdown on button click
  if (paletteBtn && colorDropdown) {
    paletteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      colorDropdown.classList.toggle('show');
    });

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (!colorDropdown.contains(e.target) && e.target !== paletteBtn) {
        colorDropdown.classList.remove('show');
      }
    });

    // Swatch selection
    swatches.forEach((swatch) => {
      swatch.addEventListener('click', () => {
        const selectedColor = swatch.getAttribute('data-color');
        applyPrimaryColor(selectedColor);
      });
    });
  }

  // --------------------------------------------------------------------------
  // 4. PROJECT FILTERING
  // --------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Toggle active filter button
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const categories = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 5. CONTACT FORM SUBMISSION WITH FEEDBACK
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const formToast = document.getElementById('form-toast');

  if (contactForm && formToast) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        alert('Please fill out all required fields.');
        return;
      }

      // Display immediate success notification
      formToast.classList.add('success');
      formToast.innerHTML = `<i class="fa-solid fa-circle-check"></i> Thank you, <strong>${name}</strong>! Your inquiry regarding "${subject}" has been received. I will reply to <em>${email}</em> promptly.`;

      // Reset form fields
      contactForm.reset();

      // Automatically hide toast after 7 seconds
      setTimeout(() => {
        formToast.classList.remove('success');
      }, 7000);
    });
  }
});
