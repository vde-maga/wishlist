// Main application - entry point and initialization

import { wishlistData } from "../data.js";
import { initTheme } from "./theme.js";
import { renderItems, renderFilters, updateFilterButtons } from "./renderer.js";
import {
  toggleTagFilter,
  setPriorityFilter,
  setPriceRangeFilter,
  setSortOrder,
  resetFilters,
  applyFilters,
  hasActiveFilter,
} from "./filters.js";

const getData = () => (Array.isArray(wishlistData) ? wishlistData : []);

const updateResultsCount = (resultsDiv, total, shown) => {
  if (!resultsDiv) return;
  resultsDiv.textContent =
    shown === total
      ? `A mostrar todos os ${total} itens`
      : `A mostrar ${shown} de ${total} itens`;
};

const refreshWishlist = () => {
  const grid = document.getElementById("wishlist-grid");
  const filtersContainer = document.getElementById("filters-container");
  const data = getData();

  const filteredData = applyFilters(data);
  renderItems(grid, filteredData, { hasFilter: hasActiveFilter() });
  updateFilterButtons(filtersContainer);

  const resultsDiv = document.getElementById("filter-results");
  updateResultsCount(resultsDiv, data.length, filteredData.length);
};

document.addEventListener("DOMContentLoaded", () => {
  const filtersContainer = document.getElementById("filters-container");
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");
  const grid = document.getElementById("wishlist-grid");

  // Initialize theme
  initTheme(themeToggle, themeIcon);

  // Render filters
  renderFilters(filtersContainer, getData());

  // Filter event listeners
  filtersContainer.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;

    const filter = btn.dataset.filter;
    const value = btn.dataset.value;

    if (btn.id === "reset-filters" || filter === "reset") {
      resetFilters();
    } else if (filter === "tag") {
      toggleTagFilter(value);
    } else if (filter === "priority") {
      setPriorityFilter(value);
    } else if (filter === "price") {
      setPriceRangeFilter(value);
    } else if (filter === "sort") {
      setSortOrder(value);
    }

    refreshWishlist();
  });

  // "Limpar filtros" button shown inside the empty state
  grid.addEventListener("click", (e) => {
    if (e.target.closest(".grid-message-action")) {
      resetFilters();
      refreshWishlist();
    }
  });

  // Initial render
  refreshWishlist();
});
