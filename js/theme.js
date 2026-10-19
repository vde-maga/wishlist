// Theme management - handles dark/light mode logic

import { storage } from "./storage.js";

const getSystemTheme = () => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const applyTheme = (theme, themeToggle, themeIcon) => {
  const isDark = theme === "dark";
  document.body.classList.remove("dark-mode", "light-mode");
  document.body.classList.add(isDark ? "dark-mode" : "light-mode");
  document.documentElement.dataset.theme = theme;

  if (themeIcon) {
    themeIcon.textContent = isDark ? "☀️" : "🌙";
  }
  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute(
      "aria-label",
      isDark ? "Mudar para tema claro" : "Mudar para tema escuro",
    );
  }
};

export const initTheme = (themeToggle, themeIcon) => {
  const storedTheme = storage.getTheme();
  const theme = storedTheme || getSystemTheme();
  applyTheme(theme, themeToggle, themeIcon);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = document.body.classList.contains("dark-mode")
        ? "dark"
        : "light";
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      applyTheme(newTheme, themeToggle, themeIcon);
      storage.setTheme(newTheme);
    });
  }

  // Listen for system theme changes
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      if (!storage.getTheme()) {
        applyTheme(e.matches ? "dark" : "light", themeToggle, themeIcon);
      }
    });
};
