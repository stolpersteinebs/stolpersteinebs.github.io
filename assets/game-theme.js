(function () {
  const storageKey = "theme";
  const labels = {
    de: { light: "🌙 Darkmode", dark: "☀️ Hellmodus" },
    en: { light: "🌙 Dark mode", dark: "☀️ Light mode" }
  };

  function getLanguage() {
    const url = new URL(window.location.href);
    if (url.searchParams.get("lang") === "en") return "en";
    return window.location.pathname.startsWith("/en/") ? "en" : "de";
  }

  function setThemeIcon(theme) {
    const icon = document.querySelector("#theme-toggle i");
    if (!icon) return;
    icon.classList.toggle("fa-moon", theme !== "dark");
    icon.classList.toggle("fa-sun", theme === "dark");
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    setThemeIcon(theme);

    const quickToggle = document.querySelector(".theme-toggle-link");
    if (quickToggle) {
      const lang = getLanguage();
      quickToggle.textContent = theme === "dark" ? labels[lang].dark : labels[lang].light;
      quickToggle.setAttribute("aria-pressed", String(theme === "dark"));
    }
  }

  function initThemeToggle() {
    const savedTheme = localStorage.getItem(storageKey);
    const initialTheme = savedTheme === "dark" ? "dark" : "light";
    applyTheme(initialTheme);

    const navToggle = document.getElementById("theme-toggle");
    if (navToggle) {
      navToggle.addEventListener("click", function () {
        const currentTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
        const nextTheme = currentTheme === "dark" ? "light" : "dark";
        localStorage.setItem(storageKey, nextTheme);
        applyTheme(nextTheme);
      });
    }

    const quickLinks = document.querySelector(".quick-links");
    if (quickLinks && !quickLinks.querySelector(".theme-toggle-link")) {
      const toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "theme-toggle-link";
      toggle.setAttribute("aria-label", "Theme umschalten");
      toggle.setAttribute("aria-pressed", String(initialTheme === "dark"));
      quickLinks.appendChild(toggle);
      applyTheme(initialTheme);

      toggle.addEventListener("click", function () {
        const currentTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
        const nextTheme = currentTheme === "dark" ? "light" : "dark";
        localStorage.setItem(storageKey, nextTheme);
        applyTheme(nextTheme);
      });
    }
  }

  function initMenu() {
    const hamburger = document.getElementById("hamburger");
    const navMenu = document.getElementById("nav-menu");
    if (!hamburger || !navMenu) return;

    hamburger.addEventListener("click", function (e) {
      e.stopPropagation();
      navMenu.classList.toggle("active");
      const icon = hamburger.querySelector("i");
      icon.classList.toggle("fa-bars");
      icon.classList.toggle("fa-times");
    });

    document.addEventListener("click", function (event) {
      if (!navMenu.contains(event.target) && !hamburger.contains(event.target)) {
        navMenu.classList.remove("active");
        const icon = hamburger.querySelector("i");
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
      }
    });

    const currentPath = window.location.pathname;
    navMenu.querySelectorAll(".nav-link").forEach((link) => {
      const href = link.getAttribute("href");
      if (href === "/spiele" && /\/(menoraquiz|feiertagsquiz|koscherspiel|schabbattischspiel|dreidspiel)\//.test(currentPath)) {
        link.classList.add("active");
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initThemeToggle();
      initMenu();
    });
  } else {
    initThemeToggle();
    initMenu();
  }
})();
