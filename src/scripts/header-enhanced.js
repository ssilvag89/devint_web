// Enhanced Header UX JavaScript - Revolutionary Interactions

class EnhancedHeaderUX {
  constructor() {
    this.header = document.getElementById("main-header");
    this.mobileMenuButton = document.getElementById("mobile-menu-button");
    this.mobileMenuOverlay = document.getElementById("mobile-menu-overlay");
    this.mobileCloseButton = document.getElementById("mobile-close-button");
    this.lastScrollY = 0;
    this.scrollDirection = "up";
    this.scrollProgress = 0;
    this.isMenuOpen = false;

    this.init();
  }

  init() {
    this.setupScrollBehavior();
    this.setupMobileMenu();
    this.setupLogoAnimations();
    this.setupInteractiveElements();
    this.setupKeyboardNavigation();
    this.setupPerformanceOptimizations();
    this.loadStylesheet();
  }

  loadStylesheet() {
    // Ensure our enhanced styles are loaded
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/src/styles/header-enhanced.css";
    document.head.appendChild(link);
  }

  setupScrollBehavior() {
    let ticking = false;
    const scrollThreshold = 50;

    const updateHeader = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - this.lastScrollY;

      // Calculate scroll progress
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      this.scrollProgress = Math.min(currentScrollY / maxScroll, 1);

      // Update progress indicator
      this.header.style.setProperty("--scroll-progress", this.scrollProgress);
      this.header.classList.toggle("scrolling", currentScrollY > 0);

      // Smart header hiding/showing
      if (Math.abs(scrollDelta) > 10) {
        if (scrollDelta > 0 && currentScrollY > scrollThreshold) {
          // Scrolling down
          this.scrollDirection = "down";
          this.header.classList.add("header-hidden");
        } else if (scrollDelta < 0) {
          // Scrolling up
          this.scrollDirection = "up";
          this.header.classList.remove("header-hidden");
        }
      }

      // Header style changes based on scroll
      if (currentScrollY > scrollThreshold) {
        this.header.classList.add("header-scrolled");
      } else {
        this.header.classList.remove("header-scrolled");
      }

      this.lastScrollY = currentScrollY;
      ticking = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(updateHeader);
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  setupMobileMenu() {
    // Mobile menu toggle
    this.mobileMenuButton?.addEventListener("click", (e) => {
      e.preventDefault();
      this.toggleMobileMenu();
    });

    // Close button
    this.mobileCloseButton?.addEventListener("click", (e) => {
      e.preventDefault();
      this.closeMobileMenu();
    });

    // Close on backdrop click
    this.mobileMenuOverlay?.addEventListener("click", (e) => {
      if (e.target === this.mobileMenuOverlay) {
        this.closeMobileMenu();
      }
    });

    // Close on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    });

    // Prevent body scroll when menu is open
    this.preventBodyScroll();
  }

  toggleMobileMenu() {
    if (this.isMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    this.isMenuOpen = true;
    this.mobileMenuButton?.setAttribute("aria-expanded", "true");
    this.mobileMenuOverlay?.classList.add("show");
    document.body.classList.add("overflow-hidden");

    // Animate menu items with stagger
    const menuItems = document.querySelectorAll(".mobile-nav-item");
    menuItems.forEach((item, index) => {
      setTimeout(() => {
        item.style.transform = "translateX(0)";
        item.style.opacity = "1";
      }, index * 100);
    });

    // Focus management
    setTimeout(() => {
      this.mobileCloseButton?.focus();
    }, 100);
  }

  closeMobileMenu() {
    this.isMenuOpen = false;
    this.mobileMenuButton?.setAttribute("aria-expanded", "false");
    this.mobileMenuOverlay?.classList.remove("show");
    document.body.classList.remove("overflow-hidden");

    // Reset menu item animations
    const menuItems = document.querySelectorAll(".mobile-nav-item");
    menuItems.forEach((item) => {
      item.style.transform = "translateX(-20px)";
      item.style.opacity = "0";
    });

    // Return focus to menu button
    this.mobileMenuButton?.focus();
  }

  preventBodyScroll() {
    let scrollPosition = 0;

    const lockScroll = () => {
      scrollPosition = window.pageYOffset;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollPosition}px`;
      document.body.style.width = "100%";
    };

    const unlockScroll = () => {
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("position");
      document.body.style.removeProperty("top");
      document.body.style.removeProperty("width");
      window.scrollTo(0, scrollPosition);
    };

    // Listen for menu state changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target.classList.contains("overflow-hidden")) {
          lockScroll();
        } else {
          unlockScroll();
        }
      });
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }

  setupLogoAnimations() {
    const logoContainer = document.getElementById("logo-container");
    const logoText = document.getElementById("logo-text");
    const brandText = document.getElementById("brand-text");

    if (logoContainer) {
      // 3D rotation effect
      logoContainer.addEventListener("mouseenter", () => {
        logoContainer.style.transform = "rotateY(180deg) scale(1.1)";
        logoText.textContent = "✨";

        setTimeout(() => {
          logoText.textContent = "GU";
          logoContainer.style.transform = "rotateY(0deg) scale(1)";
        }, 600);
      });

      // Particle burst on click
      logoContainer.addEventListener("click", (e) => {
        this.createParticleBurst(e.target, 8);
      });
    }

    // Typewriter effect for tagline
    this.startTypewriter();
  }

  createParticleBurst(element, count = 6) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement("div");
      particle.style.cssText = `
        position: fixed;
        width: 6px;
        height: 6px;
        background: linear-gradient(45deg, #3b82f6, #8b5cf6);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        left: ${centerX}px;
        top: ${centerY}px;
      `;

      document.body.appendChild(particle);

      // Animate particle
      const angle = (360 / count) * i;
      const distance = 100 + Math.random() * 50;
      const duration = 800 + Math.random() * 400;

      particle.animate(
        [
          {
            transform: "translate(0, 0) scale(1)",
            opacity: 1,
          },
          {
            transform: `translate(${
              Math.cos((angle * Math.PI) / 180) * distance
            }px, ${Math.sin((angle * Math.PI) / 180) * distance}px) scale(0)`,
            opacity: 0,
          },
        ],
        {
          duration,
          easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }
      ).onfinish = () => {
        particle.remove();
      };
    }
  }

  startTypewriter() {
    const tagline = document.querySelector(".typewriter-header");
    if (!tagline) return;

    const text = tagline.textContent;
    const words = [
      "Especialistas en San Bernardo",
      "Costura de Calidad",
      "+15 Años de Experiencia",
      "Reparaciones Expertas",
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typeWrite = () => {
      const currentWord = words[wordIndex];

      if (isDeleting) {
        tagline.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
      } else {
        tagline.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
      }

      let typeSpeed = isDeleting ? 50 : 100;

      if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000; // Pause at end
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 300; // Pause before new word
      }

      setTimeout(typeWrite, typeSpeed);
    };

    typeWrite();
  }

  setupInteractiveElements() {
    // CTA button enhancements
    const mainCTA = document.getElementById("main-cta");
    const phoneCTA = document.getElementById("phone-cta");

    if (mainCTA) {
      mainCTA.addEventListener("mouseenter", () => {
        this.addHoverSparks(mainCTA);
      });

      mainCTA.addEventListener("click", (e) => {
        this.addSuccessRipple(e.target);

        // Micro-interaction feedback
        navigator.vibrate?.(50);

        // Track conversion event
        this.trackEvent("cta_click", "header", "main_quote_button");
      });
    }

    if (phoneCTA) {
      phoneCTA.addEventListener("click", () => {
        this.trackEvent("phone_click", "header", "phone_number");
      });
    }

    // Add pulse effect to important elements
    this.setupPulseEffects();
  }

  addHoverSparks(element) {
    const sparks = [];
    const sparkCount = 5;

    for (let i = 0; i < sparkCount; i++) {
      setTimeout(() => {
        const spark = document.createElement("div");
        spark.style.cssText = `
          position: absolute;
          width: 2px;
          height: 2px;
          background: white;
          border-radius: 50%;
          pointer-events: none;
          z-index: 10;
          top: ${Math.random() * 100}%;
          left: ${Math.random() * 100}%;
        `;

        element.appendChild(spark);

        spark.animate(
          [
            { transform: "scale(0)", opacity: 1 },
            { transform: "scale(1)", opacity: 1 },
            { transform: "scale(0)", opacity: 0 },
          ],
          {
            duration: 1000,
            easing: "ease-out",
          }
        ).onfinish = () => spark.remove();
      }, i * 100);
    }
  }

  addSuccessRipple(element) {
    const ripple = document.createElement("div");
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.6);
      transform: scale(0);
      animation: success-ripple 0.6s ease-out;
      pointer-events: none;
      top: 50%;
      left: 50%;
      width: 20px;
      height: 20px;
      margin-left: -10px;
      margin-top: -10px;
    `;

    element.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }

  setupPulseEffects() {
    const elementsToAnimate = [
      { selector: "#phone-cta .w-2", delay: 2000 },
      { selector: ".particle-1", delay: 0 },
      { selector: ".particle-2", delay: 1000 },
    ];

    elementsToAnimate.forEach(({ selector, delay }) => {
      setTimeout(() => {
        const element = document.querySelector(selector);
        if (element) {
          element.style.animation = "pulse-glow 2s ease-in-out infinite";
        }
      }, delay);
    });
  }

  setupKeyboardNavigation() {
    // Enhanced keyboard navigation
    const focusableElements = [
      "#mobile-menu-button",
      "#main-cta",
      "#phone-cta",
      ".mobile-nav-item",
      "#mobile-close-button",
    ];

    focusableElements.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => {
        element.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            element.click();
          }
        });
      });
    });

    // Trap focus in mobile menu
    this.setupFocusTrap();
  }

  setupFocusTrap() {
    const mobileMenu = document.getElementById("mobile-menu-overlay");
    if (!mobileMenu) return;

    const getFocusableElements = () => {
      return mobileMenu.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
    };

    mobileMenu.addEventListener("keydown", (e) => {
      if (e.key !== "Tab") return;

      const focusableElements = getFocusableElements();
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
  }

  setupPerformanceOptimizations() {
    // Intersection Observer for animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -10% 0px",
    };

    const headerObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    }, observerOptions);

    // Observe animated elements
    document
      .querySelectorAll(".header-particle, #logo-container")
      .forEach((el) => {
        headerObserver.observe(el);
      });

    // Preload critical resources
    this.preloadResources();

    // Service Worker registration for caching
    this.registerServiceWorker();
  }

  preloadResources() {
    const criticalResources = [
      "/src/styles/header-enhanced.css",
      // Add any critical fonts or images here
    ];

    criticalResources.forEach((resource) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = resource.endsWith(".css") ? "style" : "script";
      link.href = resource;
      document.head.appendChild(link);
    });
  }

  registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .catch((err) => console.log("SW registration failed"));
    }
  }

  trackEvent(action, category, label) {
    // Analytics tracking
    if (typeof gtag !== "undefined") {
      gtag("event", action, {
        event_category: category,
        event_label: label,
        value: 1,
      });
    }

    // Custom analytics
    console.log(`Event tracked: ${action} | ${category} | ${label}`);
  }

  // Public API for external interactions
  showNotification(message, type = "success") {
    const notification = document.createElement("div");
    notification.className = `fixed top-24 right-4 z-50 px-6 py-3 rounded-xl shadow-2xl transform translate-x-full transition-transform duration-300 ${
      type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
    }`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);

    setTimeout(() => {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  highlightCTA() {
    const cta = document.getElementById("main-cta");
    if (cta) {
      cta.style.animation = "pulse-glow 1s ease-in-out 3";
      setTimeout(() => {
        cta.style.animation = "";
      }, 3000);
    }
  }
}

// Initialize Enhanced Header UX
document.addEventListener("DOMContentLoaded", () => {
  window.headerUX = new EnhancedHeaderUX();
});

// Export for external use
window.EnhancedHeaderUX = EnhancedHeaderUX;
