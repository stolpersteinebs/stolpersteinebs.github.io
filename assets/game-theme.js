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

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    const toggle = document.querySelector(".theme-toggle-link");
    if (!toggle) return;
    const lang = getLanguage();
    toggle.textContent = theme === "dark" ? labels[lang].dark : labels[lang].light;
    toggle.setAttribute("aria-pressed", String(theme === "dark"));
  }

  function initThemeToggle() {
    const quickLinks = document.querySelector(".quick-links");
    if (!quickLinks || quickLinks.querySelector(".theme-toggle-link")) return;

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "theme-toggle-link";
    toggle.setAttribute("aria-label", "Theme umschalten");
    toggle.setAttribute("aria-pressed", "false");
    quickLinks.appendChild(toggle);

    const savedTheme = localStorage.getItem(storageKey);
    const initialTheme = savedTheme === "dark" ? "dark" : "light";
    applyTheme(initialTheme);

    toggle.addEventListener("click", function () {
      const currentTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      localStorage.setItem(storageKey, nextTheme);
      applyTheme(nextTheme);
    });
  }

  const savedTheme = localStorage.getItem(storageKey);
  if (savedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initThemeToggle);
  } else {
    initThemeToggle();
  }
})();
