// Main application - entry point and initialization

import { initTheme } from "./theme.js";
import { toggleReservation } from "./reservation.js";
import { renderItems, renderFilters, updateFilterButtons } from "./renderer.js";
import {
  toggleTagFilter,
  setPriorityFilter,
  setPriceRangeFilter,
  setReservedFilter,
  setSortOrder,
  resetFilters,
  applyFilters,
} from "./filters.js";

// Make toggleReservation globally accessible for onclick handlers
window.handleReservation = (id) => {
  toggleReservation(id);
  refreshWishlist();
};

const refreshWishlist = () => {
  const grid = document.getElementById("wishlist-grid");
  const filtersContainer = document.getElementById("filters-container");

  const filteredData = applyFilters(wishlistData);
  renderItems(grid, filteredData);
  updateFilterButtons(filtersContainer);

  // Update results count
  const resultsDiv = document.getElementById("filter-results");
  if (resultsDiv) {
    const total = wishlistData.length;
    const shown = filteredData.length;
    resultsDiv.textContent =
      shown === total
        ? `A mostrar todos os ${total} itens`
        : `A mostrar ${shown} de ${total} itens`;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("wishlist-grid");
  const filtersContainer = document.getElementById("filters-container");
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");

  // Initialize theme
  initTheme(themeToggle, themeIcon);

  // Render filters
  renderFilters(filtersContainer, wishlistData);

  // Filter event listeners
  filtersContainer.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;

    const filter = btn.dataset.filter;
    const value = btn.dataset.value;

    if (btn.id === "reset-filters") {
      resetFilters();
    } else if (filter === "tag") {
      toggleTagFilter(value);
    } else if (filter === "priority") {
      setPriorityFilter(value);
    } else if (filter === "price") {
      setPriceRangeFilter(value);
    } else if (filter === "sort") {
      setSortOrder(value);
    } else if (filter === "reserved") {
      setReservedFilter(value);
    }

    refreshWishlist();
  });

  // Initial render
  refreshWishlist();
});
