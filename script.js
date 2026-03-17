document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const nav = document.getElementById("site-nav");
  const menuButton = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const themeButtons = Array.from(document.querySelectorAll("[data-theme-toggle]"));
  const navLinks = Array.from(document.querySelectorAll("[data-nav-link]"));
  const animatedItems = Array.from(document.querySelectorAll("[data-animate]"));
  const contactForm = document.getElementById("contact-form");
  const contactFeedback = document.getElementById("contact-feedback");
  const yearTarget = document.getElementById("current-year");
  const themeMeta = document.querySelector("meta[name='theme-color']");
  const storageKey = "robert-laws-theme";
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const getNavOffset = () => (nav ? nav.offsetHeight + 12 : 88);

  const setMenuState = (isOpen) => {
    if (!menuButton || !mobileMenu) {
      return;
    }

    menuButton.setAttribute("aria-expanded", String(isOpen));
    mobileMenu.classList.toggle("hidden", !isOpen);

    const openIcon = menuButton.querySelector("[data-menu-icon='open']");
    const closeIcon = menuButton.querySelector("[data-menu-icon='close']");

    if (openIcon && closeIcon) {
      openIcon.classList.toggle("hidden", isOpen);
      closeIcon.classList.toggle("hidden", !isOpen);
    }
  };

  const closeMenu = () => setMenuState(false);

  const updateThemeButtons = (isDark) => {
    themeButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(isDark));

      const label = button.querySelector("[data-theme-label]");
      const moon = button.querySelector("[data-theme-icon='moon']");
      const sun = button.querySelector("[data-theme-icon='sun']");

      if (label) {
        label.textContent = isDark ? "Light mode" : "Dark mode";
      }

      if (moon && sun) {
        moon.classList.toggle("hidden", isDark);
        sun.classList.toggle("hidden", !isDark);
      }
    });
  };

  const applyTheme = (theme) => {
    const isDark = theme === "dark";
    root.classList.toggle("dark", isDark);
    root.style.colorScheme = isDark ? "dark" : "light";
    updateThemeButtons(isDark);

    if (themeMeta) {
      themeMeta.setAttribute("content", isDark ? "#071523" : "#0A2540");
    }

    localStorage.setItem(storageKey, theme);
  };

  const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem(storageKey);

    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }

    return darkQuery.matches ? "dark" : "light";
  };

  const scrollToSection = (targetId) => {
    const section = document.querySelector(targetId);

    if (!section) {
      return;
    }

    const top = section.getBoundingClientRect().top + window.scrollY - getNavOffset();
    window.scrollTo({
      top,
      behavior: prefersReducedMotion.matches ? "auto" : "smooth",
    });
  };

  const setActiveLink = () => {
    const scrollPosition = window.scrollY + getNavOffset() + 24;
    let activeId = "";

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");

      if (!href || !href.startsWith("#")) {
        return;
      }

      const section = document.querySelector(href);

      if (!section) {
        return;
      }

      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;

      if (scrollPosition >= top && scrollPosition < bottom) {
        activeId = href;
      }
    });

    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === activeId;
      link.classList.toggle("text-brand-teal", isActive);
      link.classList.toggle("font-semibold", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const updateNavChrome = () => {
    if (!nav) {
      return;
    }

    const scrolled = window.scrollY > 12;
    nav.classList.toggle("shadow-soft", scrolled);
  };

  const initAnimations = () => {
    if (!animatedItems.length) {
      return;
    }

    if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
      animatedItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    animatedItems.forEach((item) => {
      const delay = item.dataset.animateDelay;

      if (delay) {
        item.style.transitionDelay = `${delay}ms`;
      }

      observer.observe(item);
    });
  };

  const initTheme = () => {
    applyTheme(getPreferredTheme());

    themeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const nextTheme = root.classList.contains("dark") ? "light" : "dark";
        applyTheme(nextTheme);
      });
    });

    darkQuery.addEventListener("change", (event) => {
      if (!localStorage.getItem(storageKey)) {
        applyTheme(event.matches ? "dark" : "light");
      }
    });
  };

  const initNavigation = () => {
    if (menuButton) {
      menuButton.addEventListener("click", () => {
        const isOpen = menuButton.getAttribute("aria-expanded") === "true";
        setMenuState(!isOpen);
      });
    }

    navLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        const href = link.getAttribute("href");

        if (!href || !href.startsWith("#")) {
          return;
        }

        event.preventDefault();
        scrollToSection(href);
        closeMenu();
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    document.addEventListener("click", (event) => {
      if (!menuButton || !mobileMenu) {
        return;
      }

      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (
        menuButton.getAttribute("aria-expanded") === "true" &&
        !mobileMenu.contains(target) &&
        !menuButton.contains(target)
      ) {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 768) {
        closeMenu();
      }
    });

    window.addEventListener("scroll", () => {
      setActiveLink();
      updateNavChrome();
    }, { passive: true });

    setActiveLink();
    updateNavChrome();
    closeMenu();
  };

  const initContactForm = () => {
    if (!contactForm) {
      return;
    }

    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(contactForm);
      const name = String(formData.get("name") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const subject = String(formData.get("subject") || "").trim();
      const message = String(formData.get("message") || "").trim();

      const finalSubject = subject || `Portfolio inquiry from ${name || "Website visitor"}`;
      const composedMessage = [
        name ? `Name: ${name}` : "",
        email ? `Email: ${email}` : "",
        "",
        message || "Hello Robert, I would like to connect regarding your portfolio.",
      ]
        .filter(Boolean)
        .join("\n");

      const mailtoHref = `mailto:robdlaws@gmail.com?subject=${encodeURIComponent(
        finalSubject
      )}&body=${encodeURIComponent(composedMessage)}`;

      window.location.href = mailtoHref;

      if (contactFeedback) {
        contactFeedback.textContent = "Your email client is opening with a drafted message.";
        contactFeedback.classList.remove("hidden");
      }

      contactForm.reset();

      window.setTimeout(() => {
        if (contactFeedback) {
          contactFeedback.classList.add("hidden");
          contactFeedback.textContent = "";
        }
      }, 4000);
    });
  };

  const initLucide = () => {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  };

  if (yearTarget) {
    yearTarget.textContent = String(new Date().getFullYear());
  }

  initTheme();
  initNavigation();
  initAnimations();
  initContactForm();
  initLucide();
});
