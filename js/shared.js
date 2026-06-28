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
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" style="width: 20px; height: 20px;">
                <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.38v78.48a84.07,84.07,0,1,0,40.3,71V0h78.34a108.94,108.94,0,0,0,10.63,45.74,109,109,0,0,0,76.54,62.8v78.34A109,109,0,0,0,448,209.91Z"/>
              </svg>
            </a>
            <a href="#" class="social-icon" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" style="width: 20px; height: 20px;">
                <path d="M224,202.66A74.34,74.34,0,1,0,298.34,277,74.34,74.34,0,0,0,224,202.66Zm0,122A47.66,47.66,0,1,1,271.66,277,47.66,47.66,0,0,1,224,324.66ZM348,170.34a27.66,27.66,0,1,1-27.66-27.66A27.66,27.66,0,0,1,348,170.34ZM448,140.34c0-54-15.66-96.66-55.34-136.34S298.66,0,244.66,0h-41.32C149.34,0,106.68,15.66,67,55.34S11.68,149.66,11.68,203.66v41.32c0,54,15.66,96.66,55.34,136.34S149.34,488,203.34,488h41.32c54,0,96.66-15.66,136.34-55.34S436.34,338.34,436.34,284.34V243ZM392.34,328c-10.66,26.68-31.32,47.34-58,58S280.34,399,224,399s-91-3.66-110.34-13-47.34-31.32-58-58S42.34,280.34,42.34,224s3.66-91,13-110.34,31.32-47.34,58-58S167.66,43,224,43s91,3.66,110.34,13,47.34,31.32,58,58S405.66,167.66,405.66,224,402,315,392.34,328Z"/>
              </svg>
            </a>
            <a href="#" class="social-icon" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" style="width: 20px; height: 20px;">
                <path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.38 19.12-40.38 38.73V256h68.75l-11 71.69h-57.75V501C413.31 482.38 504 379.78 504 256z"/>
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
