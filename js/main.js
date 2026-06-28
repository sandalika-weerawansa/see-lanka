/**
 * Traveler Interactive Page Interactivity Scripts
 */

document.addEventListener("DOMContentLoaded", () => {
  // Page-specific initializations
  initHome();
  initPlanner();
  initExplore();
  initHelp();
  initPrivacy();
});

/* ==========================================================================
   Home Page Logic
   ========================================================================== */
function initHome() {
  const searchForm = document.querySelector('.search-widget form');
  const searchInput = document.querySelector('.search-field input[type="text"]');
  const searchTags = document.querySelectorAll('.search-tag');

  if (!searchInput) return;

  // 1. Tag click populates search input
  searchTags.forEach(tag => {
    tag.addEventListener('click', () => {
      const destination = tag.textContent.replace('+', '').trim();
      searchInput.value = destination;
      
      // Visual click feedback
      tag.style.transform = 'scale(0.95)';
      setTimeout(() => tag.style.transform = 'scale(1)', 100);
    });
  });

  // 2. Form submission redirects to Planner with URL parameters
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const destination = searchInput.value.trim();
      const guests = document.getElementById('guests').value;
      const dateVal = document.getElementById('dates').value;

      // Construct URL parameters
      let targetUrl = `planner.html?destination=${encodeURIComponent(destination)}`;
      if (guests) targetUrl += `&guests=${encodeURIComponent(guests)}`;
      if (dateVal) targetUrl += `&date=${encodeURIComponent(dateVal)}`;

      // Redirect to Planner Page
      window.location.href = targetUrl;
    });
  }
}

/* ==========================================================================
   Planner Page Logic
   ========================================================================== */
function initPlanner() {
  const slider = document.querySelector('.range-slider');
  const paceLabel = document.querySelector('.slider-labels .value');
  const transportBtns = document.querySelectorAll('.transport-btn');
  const itineraryCards = document.querySelectorAll('.itinerary-card');
  const plannerHeader = document.querySelector('.planner-content h2');

  if (!slider && !transportBtns.length) return;

  // Helper mapping values to strings
  const paceValues = ["0", "1", "2"];
  const paceLevels = ["Relaxed", "Moderate", "Intense"];
  
  // Create an alert/empty state element inside itinerary containers if no matches
  const timelineDays = document.querySelectorAll('.timeline-day');
  
  const createNoMatchAlerts = () => {
    timelineDays.forEach(day => {
      const cardContainer = day.querySelector('.itinerary-cards');
      if (cardContainer && !day.querySelector('.no-match-alert')) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'no-match-alert';
        alertDiv.style.display = 'none';
        alertDiv.style.padding = '30px';
        alertDiv.style.textAlign = 'center';
        alertDiv.style.backgroundColor = 'var(--bg-tertiary)';
        alertDiv.style.borderRadius = 'var(--radius-lg)';
        alertDiv.style.border = '1px dashed var(--border-dark)';
        alertDiv.style.gridColumn = '1 / -1';
        alertDiv.innerHTML = `
          <i data-lucide="compass-off" style="margin: 0 auto 10px; display: block; color: var(--text-light); width: 32px; height: 32px;"></i>
          <h4 style="margin-bottom: 4px;">No Matching Activities</h4>
          <p style="font-size: 0.85rem; color: var(--text-light);">Try adjusting your transport mode or pace range.</p>
        `;
        cardContainer.appendChild(alertDiv);
      }
    });
    if (typeof lucide !== "undefined") lucide.createIcons();
  };
  createNoMatchAlerts();

  // Primary filtering function
  const filterItinerary = () => {
    const activeTransportBtn = document.querySelector('.transport-btn.selected');
    const selectedTransport = activeTransportBtn ? activeTransportBtn.querySelector('span').textContent.toLowerCase() : "";
    const activePaceValue = slider ? slider.value : "1";

    // Map display transport string to card metadata values
    let transportFilter = "tuk-tuk";
    if (selectedTransport.includes("rail") || selectedTransport.includes("train")) {
      transportFilter = "train";
    } else if (selectedTransport.includes("plane")) {
      transportFilter = "plane";
    }

    timelineDays.forEach(day => {
      let visibleCount = 0;
      const cards = day.querySelectorAll('.itinerary-card');
      const alert = day.querySelector('.no-match-alert');

      cards.forEach(card => {
        const cardTransport = card.getAttribute('data-transport');
        const cardPace = card.getAttribute('data-pace');

        // Match logic: transport matches AND pace matches
        const isMatch = (cardTransport === transportFilter) && (cardPace === activePaceValue);

        if (isMatch) {
          card.style.display = 'grid';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      // Show/hide no match alert
      if (alert) {
        // Only show alert if Day is unlocked, or if it is Day 1 (Day 1 is always unlocked)
        const isDayLocked = day.classList.contains('day-locked') && !day.querySelector('#day-2-itinerary').classList.contains('show');
        if (visibleCount === 0 && !isDayLocked) {
          alert.style.display = 'block';
        } else {
          alert.style.display = 'none';
        }
      }
    });
  };

  // 1. Interactive Pace Slider
  if (slider && paceLabel) {
    const updateSliderValue = () => {
      const val = parseInt(slider.value);
      paceLabel.textContent = paceLevels[val];
      
      if (val === 0) {
        paceLabel.style.color = '#10b981'; // green
      } else if (val === 1) {
        paceLabel.style.color = 'var(--primary)'; // blue
      } else {
        paceLabel.style.color = '#ef4444'; // red
      }
      filterItinerary();
    };

    slider.addEventListener('input', updateSliderValue);
  }

  // 2. Transport Selector Trigger
  transportBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      transportBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      filterItinerary();
    });
  });

  // 3. Atmosphere Filters (toggles match percentage values dynamically for fun!)
  const filterTags = document.querySelectorAll('.filter-tag');
  const matchPercentage = document.querySelector('.planner-meta strong');

  filterTags.forEach(tag => {
    tag.addEventListener('click', () => {
      tag.classList.toggle('selected');
      
      // Dynamic Match calculations for visual premium polish
      const selectedCount = document.querySelectorAll('.filter-tag.selected').length;
      if (matchPercentage) {
        let baseMatch = 90;
        let newMatch = baseMatch + (selectedCount * 2) - (selectedCount === 0 ? 5 : 0);
        newMatch = Math.min(newMatch, 99);
        matchPercentage.textContent = `${newMatch}% match`;
      }
    });
  });

  // 4. URL Param Handler (Routes query from homepage Search widget!)
  const loadUrlParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const destination = urlParams.get('destination');
    const paceParam = urlParams.get('pace');
    const transportParam = urlParams.get('transport');

    if (destination && plannerHeader) {
      plannerHeader.innerHTML = `Enchanted Island: <span style="color: var(--primary);">${escapeHtml(destination)}</span> Journey`;
    }

    // Set transport from url params
    if (transportParam) {
      transportBtns.forEach(btn => {
        const text = btn.querySelector('span').textContent.toLowerCase();
        if (text.includes(transportParam.toLowerCase())) {
          transportBtns.forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
        }
      });
    } else if (destination) {
      // Intelligently default transport based on search keywords!
      const destLower = destination.toLowerCase();
      let defaultTransportIndex = 0; // default Tuk-tuk
      
      if (destLower.includes("ella") || destLower.includes("train") || destLower.includes("rail")) {
        defaultTransportIndex = 1; // Rail
      } else if (destLower.includes("seaplane") || destLower.includes("fly") || destLower.includes("resort")) {
        defaultTransportIndex = 2; // Seaplane
      }

      transportBtns.forEach(b => b.classList.remove('selected'));
      transportBtns[defaultTransportIndex].classList.add('selected');
    }

    // Set slider value
    if (paceParam && slider) {
      const index = paceLevels.findIndex(p => p.toLowerCase() === paceParam.toLowerCase());
      if (index !== -1) {
        slider.value = index;
      }
    }
  };

  loadUrlParams();
  filterItinerary(); // Run initial filter matching

  // 5. Like Buttons
  const likeBtns = document.querySelectorAll('.like-btn');
  likeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      btn.classList.toggle('active');
      const heartIcon = btn.querySelector('i');
      if (btn.classList.contains('active')) {
        heartIcon.setAttribute('data-lucide', 'heart');
        heartIcon.style.fill = '#ef4444';
        heartIcon.style.stroke = '#ef4444';
      } else {
        heartIcon.style.fill = 'none';
        heartIcon.style.stroke = 'currentColor';
      }
      if (typeof lucide !== "undefined") lucide.createIcons();
    });
  });

  // 6. Unlock Day 2 Itinerary
  const unlockWidget = document.getElementById('unlock-day-2-btn');
  const hiddenItinerary = document.getElementById('day-2-itinerary');

  if (unlockWidget && hiddenItinerary) {
    unlockWidget.addEventListener('click', () => {
      unlockWidget.style.display = 'none';
      hiddenItinerary.classList.add('show');
      
      // Refresh filter in case Day 2 was locked
      filterItinerary();

      setTimeout(() => {
        hiddenItinerary.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    });
  }
}

/* ==========================================================================
   Explore Page Logic
   ========================================================================== */
function initExplore() {
  // 1. Animate Progress Bar
  const progressBar = document.querySelector('.offset-progress-bar');
  if (progressBar) {
    setTimeout(() => {
      progressBar.style.width = '62%';
    }, 300);
  }

  // 2. Newsletter Form Validation
  const ctaForm = document.querySelector('.cta-form');
  const emailInput = document.querySelector('.cta-form input[type="email"]');
  const feedbackMessage = document.querySelector('.subscribe-feedback');

  if (ctaForm && emailInput && feedbackMessage) {
    ctaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailVal = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (emailRegex.test(emailVal)) {
        feedbackMessage.textContent = "Thank you for subscribing! Check your inbox for eco-travel tips.";
        feedbackMessage.className = "subscribe-feedback success";
        emailInput.value = "";
      } else {
        feedbackMessage.textContent = "Please enter a valid email address.";
        feedbackMessage.className = "subscribe-feedback error";
      }
    });
  }

  // 3. Green Stays Sliding Carousel (Swaps order of elements to rotate cards!)
  const leftArrow = document.querySelector('.arrow-btn:first-of-type');
  const rightArrow = document.querySelector('.arrow-btn:last-of-type');
  const staysGrid = document.querySelector('.section-padding .grid-3');

  if (leftArrow && rightArrow && staysGrid) {
    rightArrow.addEventListener('click', () => {
      const cards = staysGrid.querySelectorAll('.stay-card');
      if (cards.length > 0) {
        // Move first card to the end (rotate right)
        staysGrid.appendChild(cards[0]);
        
        // Add smooth shift animation
        staysGrid.style.transform = 'translateX(10px)';
        setTimeout(() => staysGrid.style.transform = 'translateX(0)', 150);
      }
    });

    leftArrow.addEventListener('click', () => {
      const cards = staysGrid.querySelectorAll('.stay-card');
      if (cards.length > 0) {
        // Move last card to the beginning (rotate left)
        staysGrid.insertBefore(cards[cards.length - 1], cards[0]);
        
        // Add smooth shift animation
        staysGrid.style.transform = 'translateX(-10px)';
        setTimeout(() => staysGrid.style.transform = 'translateX(0)', 150);
      }
    });
  }
}

/* ==========================================================================
   Help Center Page Logic
   ========================================================================== */
function initHelp() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  const helpSearch = document.querySelector('.help-search-bar input');
  const searchForm = document.querySelector('.help-search-bar');
  const faqList = document.querySelector('.faq-list');
  const helpTags = document.querySelectorAll('.help-tag');

  if (!faqList) return;

  // 1. FAQ Accordions toggling
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const content = item.querySelector('.accordion-content');
      const isActive = item.classList.contains('active');

      document.querySelectorAll('.accordion-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.accordion-content').style.maxHeight = null;
          otherItem.querySelector('.accordion-content').style.paddingBottom = '0px';
        }
      });

      if (isActive) {
        item.classList.remove('active');
        content.style.maxHeight = null;
        content.style.paddingBottom = '0px';
      } else {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 24 + 'px';
        content.style.paddingBottom = '24px';
      }
    });
  });

  // Create FAQ empty state
  const noFaqDiv = document.createElement('div');
  noFaqDiv.className = 'no-faq-alert';
  noFaqDiv.style.display = 'none';
  noFaqDiv.style.padding = '40px';
  noFaqDiv.style.textAlign = 'center';
  noFaqDiv.style.backgroundColor = 'var(--bg-secondary)';
  noFaqDiv.style.borderRadius = 'var(--radius-lg)';
  noFaqDiv.style.border = '1px solid var(--border-light)';
  noFaqDiv.innerHTML = `
    <i data-lucide="help-circle" style="margin: 0 auto 12px; display: block; color: var(--text-light); width: 36px; height: 36px;"></i>
    <h4 style="margin-bottom: 6px;">No FAQs Found</h4>
    <p style="font-size: 0.9rem; color: var(--text-light);">Try searching for terms like "train", "visa", "atm", or "refund".</p>
  `;
  faqList.appendChild(noFaqDiv);
  if (typeof lucide !== "undefined") lucide.createIcons();

  // 2. Real-time Live FAQ Filtering
  const runFaqSearch = (query) => {
    const term = query.toLowerCase().trim();
    const items = faqList.querySelectorAll('.accordion-item');
    let visibleCount = 0;

    items.forEach(item => {
      const qText = item.querySelector('.accordion-header h4').textContent.toLowerCase();
      const aText = item.querySelector('.accordion-content p').textContent.toLowerCase();

      if (qText.includes(term) || aText.includes(term)) {
        item.style.display = 'block';
        visibleCount++;
      } else {
        item.style.display = 'none';
        
        // Close if open and hidden
        item.classList.remove('active');
        item.querySelector('.accordion-content').style.maxHeight = null;
        item.querySelector('.accordion-content').style.paddingBottom = '0px';
      }
    });

    if (visibleCount === 0) {
      noFaqDiv.style.display = 'block';
    } else {
      noFaqDiv.style.display = 'none';
    }
  };

  if (helpSearch) {
    helpSearch.addEventListener('input', (e) => {
      runFaqSearch(e.target.value);
    });

    if (searchForm) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        runFaqSearch(helpSearch.value);
      });
    }
  }

  // 3. Popular Tags sets input & filters FAQ
  helpTags.forEach(tag => {
    tag.addEventListener('click', () => {
      const text = tag.textContent.trim();
      if (helpSearch) {
        helpSearch.value = text;
        helpSearch.focus();
        runFaqSearch(text);
      }
    });
  });

  // 4. Parse URL query params on load (e.g. from Global Search)
  const parseUrlParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam && helpSearch) {
      helpSearch.value = searchParam;
      helpSearch.focus();
      runFaqSearch(searchParam);
    }
  };
  parseUrlParams();
}

/* ==========================================================================
   Privacy Policy Page Logic
   ========================================================================== */
function initPrivacy() {
  const tocItems = document.querySelectorAll('.policy-toc-item');
  const sections = document.querySelectorAll('.policy-content-section');
  const contactDpoBtn = document.querySelector('.sidebar-help-card button');

  if (tocItems.length === 0 || sections.length === 0) return;

  // 1. Table of Contents Scroll spying & smooth click scrolling
  tocItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetId = item.getAttribute('data-target');
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        const yOffset = -90; 
        const y = targetSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
        
        window.scrollTo({ top: y, behavior: 'smooth' });
        
        tocItems.forEach(t => t.classList.remove('active'));
        item.classList.add('active');
      }
    });
  });

  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      tocItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-target') === currentSectionId) {
          item.classList.add('active');
        }
      });
    }
  });

  // 2. Interactive Contact DPO Modal Popup!
  if (contactDpoBtn) {
    contactDpoBtn.addEventListener('click', () => {
      // Build Modal elements programmatically for maximum clean structure
      const modalOverlay = document.createElement('div');
      modalOverlay.style.position = 'fixed';
      modalOverlay.style.top = '0';
      modalOverlay.style.left = '0';
      modalOverlay.style.width = '100vw';
      modalOverlay.style.height = '100vh';
      modalOverlay.style.backgroundColor = 'rgba(15, 23, 42, 0.6)';
      modalOverlay.style.backdropFilter = 'blur(4px)';
      modalOverlay.style.zIndex = '1000';
      modalOverlay.style.display = 'flex';
      modalOverlay.style.alignItems = 'center';
      modalOverlay.style.justifyContent = 'center';
      modalOverlay.style.opacity = '0';
      modalOverlay.style.transition = 'opacity 0.3s ease';

      const modalContent = document.createElement('div');
      modalContent.className = 'shadow-card';
      modalContent.style.backgroundColor = 'var(--bg-secondary)';
      modalContent.style.padding = '32px';
      modalContent.style.borderRadius = 'var(--radius-lg)';
      modalContent.style.maxWidth = '450px';
      modalContent.style.width = '90%';
      modalContent.style.position = 'relative';
      modalContent.style.transform = 'translateY(-20px)';
      modalContent.style.transition = 'transform 0.3s ease';

      modalContent.innerHTML = `
        <button class="modal-close-btn" style="position: absolute; top: 16px; right: 16px; color: var(--text-light); cursor: pointer;"><i data-lucide="x"></i></button>
        <h3 style="margin-bottom: 12px; font-size: 1.5rem; display: flex; align-items: center; gap: 8px;">
          <i data-lucide="shield-check" style="color: var(--primary);"></i> DPO Inquiries
        </h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 20px;">
          Submit your queries directly to our Data Protection Officer regarding GDPR requests, erasures, or audits.
        </p>
        <form id="dpo-modal-form" style="display: flex; flex-direction: column; gap: 14px;">
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <label style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase;">Email Address</label>
            <input type="email" placeholder="you@example.com" required style="border: 1px solid var(--border-light); padding: 10px; border-radius: var(--radius-sm); font-size: 0.9rem;">
          </div>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <label style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase;">Request Details</label>
            <textarea placeholder="How can we assist you with your data?" required style="border: 1px solid var(--border-light); padding: 10px; border-radius: var(--radius-sm); font-size: 0.9rem; height: 100px; resize: none;"></textarea>
          </div>
          <button type="submit" class="btn btn-primary" style="margin-top: 10px;">Send Request</button>
        </form>
      `;

      document.body.appendChild(modalOverlay);
      modalOverlay.appendChild(modalContent);
      if (typeof lucide !== "undefined") lucide.createIcons();

      // Trigger animations
      setTimeout(() => {
        modalOverlay.style.opacity = '1';
        modalContent.style.transform = 'translateY(0)';
      }, 50);

      // Close functions
      const closeModal = () => {
        modalOverlay.style.opacity = '0';
        modalContent.style.transform = 'translateY(-20px)';
        setTimeout(() => {
          document.body.removeChild(modalOverlay);
        }, 300);
      };

      modalContent.querySelector('.modal-close-btn').addEventListener('click', closeModal);
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
      });

      // Submit function
      modalContent.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Show success inside form
        modalContent.innerHTML = `
          <div style="text-align: center; padding: 20px 0;">
            <i data-lucide="check-circle" style="color: var(--success); width: 48px; height: 48px; margin: 0 auto 16px;"></i>
            <h3 style="margin-bottom: 8px;">Request Submitted</h3>
            <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 24px;">Your request has been successfully transmitted. Our DPO will contact you within 72 hours.</p>
            <button class="btn btn-secondary close-success-btn" style="padding: 10px 24px;">Done</button>
          </div>
        `;
        if (typeof lucide !== "undefined") lucide.createIcons();
        modalContent.querySelector('.close-success-btn').addEventListener('click', closeModal);
      });
    });
  }
}

/* ==========================================================================
   Helper Utilities
   ========================================================================== */
function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
