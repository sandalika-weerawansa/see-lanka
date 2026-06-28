/**
 * Traveler Shared Header & Footer Layout Manager
 */

document.addEventListener("DOMContentLoaded", () => {
  injectHeader();
  injectFooter();
  initCustomCursor();
  
  // Initialize Lucide icons if available
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
});

function injectHeader() {
  const headerElement = document.querySelector("header");
  if (!headerElement) return;

  // Determine current active page
  const path = window.location.pathname;
  const pageName = path.split("/").pop() || "index.html";

  // Build Navigation Items
  const navItems = [
    { label: "Home", url: "index.html", activeOn: ["index.html", ""] },
    { label: "Planner", url: "planner.html", activeOn: ["planner.html"] },
    { label: "Explore", url: "explore.html", activeOn: ["explore.html"] },
    { label: "Wallet", url: "wallet.html", activeOn: ["wallet.html"] },
  ];

  // Help center page replaces profile or has its own active state
  let hasHelpCenter = pageName === "help.html";
  
  let navHtml = "";
  navItems.forEach(item => {
    const isActive = item.activeOn.includes(pageName);
    navHtml += `<li class="${isActive ? 'active' : ''}"><a href="${item.url}">${item.label}</a></li>`;
  });

  // Handle Help Center and Profile navigation states (5th item)
  if (hasHelpCenter) {
    navHtml += `<li class="active"><a href="help.html">Help Center</a></li>`;
  } else {
    navHtml += `<li class="${pageName === 'profile.html' ? 'active' : ''}"><a href="profile.html">Profile</a></li>`;
  }

  const searchIconHtml = (pageName === "index.html" || pageName === "privacy.html") 
    ? `<button class="icon-btn search-btn"><i data-lucide="search"></i></button>`
    : "";

  headerElement.innerHTML = `
    <div class="container">
      <a href="index.html" class="logo-text" style="display: flex; align-items: center;">
        <img src="assets/logo.png" alt="See Lanka" style="height: 38px; object-fit: contain;">
      </a>
      <nav>
        <ul>
          ${navHtml}
        </ul>
      </nav>
      <div class="header-icons">
        ${searchIconHtml}
        <a href="profile.html" class="icon-btn profile-btn"><i data-lucide="user"></i></a>
      </div>
    </div>
  `;

  // Bind click event to Search button
  const searchBtn = headerElement.querySelector(".search-btn");
  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      openGlobalSearch();
    });
  }
}

function injectFooter() {
  const footerElement = document.querySelector("footer");
  if (!footerElement) return;

  footerElement.innerHTML = `
    <div class="container">
      <div class="footer-top">
        <div class="footer-brand">
          <img src="assets/logo_bw.png" alt="See Lanka" class="footer-logo">
          <p class="footer-desc">
            Your ultimate companion for seamless travel planning, budget tracking, and discovering hidden gems around the globe.
          </p>
          <div class="social-links">
            <a href="#" class="social-icon" aria-label="TikTok">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width: 22px; height: 22px;">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.6-4.12-1.34a10.15 10.15 0 0 1-2.07-1.74v7.62a7.5 7.5 0 1 1-5.55-7.29v4.03a3.5 3.5 0 1 0 1.55 3.26V0h.29z"/>
              </svg>
            </a>
            <a href="#" class="social-icon" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width: 22px; height: 22px;">
                <path d="M12 0C8.74 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.74 0 12s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.257 0 3.666-.014 4.947-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.257-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 2.92c3.185 0 3.563.012 4.822.069 3.496.16 5.176 1.861 5.335 5.335.057 1.259.069 1.637.069 4.822 0 3.186-.012 3.564-.069 4.822-.16 3.493-1.84 5.176-5.335 5.335-1.259.057-1.637.069-4.822.069-3.185 0-3.563-.012-4.822-.069-3.497-.16-5.176-1.861-5.335-5.335-.057-1.259-.069-1.637-.069-4.822 0-3.185.012-3.563.069-4.822.16-3.497 1.862-5.176 5.335-5.335 1.259-.057 1.637-.069 4.822-.069zM12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 15.27a3.27 3.27 0 1 1 0-6.54 3.27 3.27 0 0 1 0 6.54zm5.717-9.593a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
              </svg>
            </a>
            <a href="#" class="social-icon" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width: 22px; height: 22px;">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          </div>
        </div>
        
        <div class="footer-col">
          <h4>Company</h4>
          <ul>
            <li><a href="index.html">About Us</a></li>
            <li><a href="explore.html">Sustainability</a></li>
          </ul>
        </div>
        
        <div class="footer-col">
          <h4>Explore</h4>
          <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="index.html#destinations">Destinations</a></li>
            <li><a href="planner.html">Planner</a></li>
            <li><a href="wallet.html">Wallet</a></li>
          </ul>
        </div>
        
        <div class="footer-col">
          <h4>Support</h4>
          <ul>
            <li><a href="help.html">Help Center</a></li>
            <li><a href="privacy.html">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      
      <div class="footer-bottom flex-between">
        <div class="footer-copyright">
          © 2026 NIBMAPI. All rights reserved.
        </div>
        <div class="footer-meta">
          <span>English (US)</span>
          <span>USD</span>
        </div>
      </div>
    </div>
  `;
}

function initCustomCursor() {
  // Only initialize on devices with mouse pointers (pointer: fine)
  if (!window.matchMedia("(pointer: fine)").matches) return;

  // Create cursor elements
  const dot = document.createElement("div");
  dot.className = "custom-cursor-dot";
  const ring = document.createElement("div");
  ring.className = "custom-cursor-ring";

  document.body.appendChild(dot);
  document.body.appendChild(ring);

  // Cursor coordinates
  let mouseX = 0;
  let mouseY = 0;
  let dotX = 0;
  let dotY = 0;
  let ringX = 0;
  let ringY = 0;

  // Track mouse coordinates
  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth animation frame loop
  const animateCursor = () => {
    const dotLag = 0.2;
    const ringLag = 0.12;

    dotX += (mouseX - dotX) * dotLag;
    dotY += (mouseY - dotY) * dotLag;
    ringX += (mouseX - ringX) * ringLag;
    ringY += (mouseY - ringY) * ringLag;

    dot.style.left = `${dotX}px`;
    dot.style.top = `${dotY}px`;
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;

    requestAnimationFrame(animateCursor);
  };
  animateCursor();

  // Handle Hover Effects on interactive items
  const addHoverListeners = () => {
    const hoverables = document.querySelectorAll(
      "a, button, select, input, textarea, .filter-tag, .transport-btn, .accordion-header, .search-tag, .action-icon-btn, .like-btn, .policy-toc-item, .arrow-btn, .unlock-widget"
    );

    hoverables.forEach(item => {
      if (item.getAttribute("data-has-cursor-listener")) return;
      item.setAttribute("data-has-cursor-listener", "true");

      item.addEventListener("mouseenter", () => {
        document.body.classList.add("custom-cursor-hover");
      });
      item.addEventListener("mouseleave", () => {
        document.body.classList.remove("custom-cursor-hover");
      });
    });
  };

  // Run hover listener attach
  addHoverListeners();

  // Watch for dynamic DOM changes (like dynamic lists or modals)
  const observer = new MutationObserver(() => {
    addHoverListeners();
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

function openGlobalSearch() {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.backgroundColor = "rgba(15, 23, 42, 0.6)";
  overlay.style.backdropFilter = "blur(8px)";
  overlay.style.zIndex = "2000";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.opacity = "0";
  overlay.style.transition = "opacity 0.25s ease";

  const content = document.createElement("div");
  content.className = "shadow-card";
  content.style.backgroundColor = "var(--bg-secondary)";
  content.style.padding = "40px";
  content.style.borderRadius = "var(--radius-lg)";
  content.style.maxWidth = "600px";
  content.style.width = "90%";
  content.style.position = "relative";
  content.style.transform = "translateY(-30px)";
  content.style.transition = "transform 0.25s ease";

  content.innerHTML = `
    <button class="modal-close-btn" style="position: absolute; top: 20px; right: 20px; color: var(--text-light); cursor: pointer;"><i data-lucide="x"></i></button>
    <h3 style="margin-bottom: 20px; font-size: 1.5rem; display: flex; align-items: center; gap: 10px;">
      <i data-lucide="search" style="color: var(--primary);"></i> Global Search
    </h3>
    <form id="global-search-form" style="display: flex; flex-direction: column; gap: 16px;">
      <div style="display: flex; gap: 10px; background-color: var(--bg-primary); border: 1px solid var(--border-light); padding: 8px 8px 8px 16px; border-radius: var(--radius-md); align-items: center;">
        <i data-lucide="search" style="color: var(--text-light); width: 20px;"></i>
        <input type="text" id="global-search-input" placeholder="Search destinations, eco stays, help questions..." required style="flex-grow: 1; border: none; font-size: 1rem; background: none;">
        <button type="submit" class="btn btn-primary" style="padding: 8px 20px;">Search</button>
      </div>
      <div style="font-size: 0.8rem; color: var(--text-light);">
        Popular suggestions: 
        <span class="search-suggest" style="color: var(--primary); font-weight: 600; cursor: pointer; text-decoration: underline; margin-left: 4px;">Sigiriya</span>,
        <span class="search-suggest" style="color: var(--primary); font-weight: 600; cursor: pointer; text-decoration: underline; margin-left: 4px;">Train Booking</span>,
        <span class="search-suggest" style="color: var(--primary); font-weight: 600; cursor: pointer; text-decoration: underline; margin-left: 4px;">Eco Stay</span>,
        <span class="search-suggest" style="color: var(--primary); font-weight: 600; cursor: pointer; text-decoration: underline; margin-left: 4px;">Privacy policy</span>
      </div>
    </form>
  `;

  document.body.appendChild(overlay);
  overlay.appendChild(content);
  if (typeof lucide !== "undefined") lucide.createIcons();

  const inputField = content.querySelector("#global-search-input");
  setTimeout(() => {
    overlay.style.opacity = "1";
    content.style.transform = "translateY(0)";
    if (inputField) inputField.focus();
  }, 50);

  const closeModal = () => {
    overlay.style.opacity = "0";
    content.style.transform = "translateY(-30px)";
    setTimeout(() => overlay.remove(), 250);
  };

  content.querySelector(".modal-close-btn").addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  const suggests = content.querySelectorAll(".search-suggest");
  suggests.forEach(suggest => {
    suggest.addEventListener("click", () => {
      if (inputField) {
        inputField.value = suggest.textContent;
        inputField.focus();
      }
    });
  });

  content.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    const query = inputField.value.trim().toLowerCase();
    
    if (!query) return;

    let targetUrl = "planner.html?destination=" + encodeURIComponent(query);

    if (query.includes("help") || query.includes("visa") || query.includes("cancel") || query.includes("refund") || query.includes("ticket") || query.includes("atm") || query.includes("police") || query.includes("hospital")) {
      targetUrl = "help.html?search=" + encodeURIComponent(query);
    } else if (query.includes("privacy") || query.includes("data") || query.includes("gdpr") || query.includes("dpo") || query.includes("rights") || query.includes("security")) {
      targetUrl = "privacy.html";
    } else if (query.includes("eco") || query.includes("green") || query.includes("carbon") || query.includes("offset") || query.includes("stay") || query.includes("villa") || query.includes("safari")) {
      targetUrl = "explore.html";
    } else if (query.includes("wallet") || query.includes("budget") || query.includes("spent") || query.includes("save") || query.includes("money")) {
      targetUrl = "wallet.html";
    }

    closeModal();
    setTimeout(() => {
      window.location.href = targetUrl;
    }, 250);
  });
}
