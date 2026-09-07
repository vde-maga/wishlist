// Theme management - handles dark/light mode logic

import { storage } from "./storage.js";

const getSystemTheme = () => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const applyTheme = (theme, themeIcon) => {
  document.body.classList.remove("dark-mode", "light-mode");

  if (theme === "dark") {
    document.body.classList.add("dark-mode");
    themeIcon.textContent = "☀️";
  } else {
    document.body.classList.add("light-mode");
    themeIcon.textContent = "🌙";
  }
};

export const initTheme = (themeToggle, themeIcon) => {
  const storedTheme = storage.getTheme();
  const theme = storedTheme || getSystemTheme();
  applyTheme(theme, themeIcon);

  themeToggle.addEventListener("click", () => {
    const currentTheme = document.body.classList.contains("dark-mode")
      ? "dark"
      : "light";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(newTheme, themeIcon);
    storage.setTheme(newTheme);
  });

  // Listen for system theme changes
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      const storedTheme = storage.getTheme();
      if (!storedTheme) {
        applyTheme(e.matches ? "dark" : "light", themeIcon);
      }
    });
};
