// Main application - entry point and initialization

import { initTheme } from "./theme.js";
import { toggleReservation } from "./reservation.js";
import { renderItems } from "./renderer.js";

// Make toggleReservation globally accessible for onclick handlers
window.handleReservation = (id) => {
  toggleReservation(id);
  // Changed from window.wishlistData to just wishlistData
  renderItems(document.getElementById("wishlist-grid"), wishlistData);
};

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("wishlist-grid");
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");

  // Initialize theme
  initTheme(themeToggle, themeIcon);

  // Changed from window.wishlistData to just wishlistData
  renderItems(grid, wishlistData);
});
