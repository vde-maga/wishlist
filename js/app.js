// Main application - entry point and initialization

import { wishlistData } from "../data.js";
import { initTheme } from "./theme.js";
import { renderItems, renderFilters, updateFilterButtons } from "./renderer.js";
import {
  toggleTagFilter,
  setPriorityFilter,
  setPriceRangeFilter,
  setSortOrder,
  setSearchQuery,
  resetFilters,
  applyFilters,
  hasActiveFilter,
  hydrateFiltersFromURL,
  syncFiltersToURL,
} from "./filters.js";

const getData = () => (Array.isArray(wishlistData) ? wishlistData : []);

const copyText = async (text) => {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Fall back to the legacy path below when clipboard access is denied.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    if (!document.execCommand("copy")) {
      throw new Error("Copy command failed");
    }
  } finally {
    textarea.remove();
  }
};

const shareItem = async (button) => {
  const card = button.closest(".card");
  const title =
    card?.querySelector(".card-title")?.textContent?.trim() || document.title;
  const url = new URL(window.location.href);
  url.hash = `item-${button.dataset.shareId}`;
  url.search = "";

  if (navigator.share) {
    try {
      await navigator.share({ title, text: title, url: url.toString() });
      return;
    } catch (error) {
      if (error?.name === "AbortError") return;
    }
  }

  const originalText = button.textContent;
  try {
    await copyText(url.toString());
    button.textContent = "Copiado!";
  } catch (error) {
    console.error("Error copying item link:", error);
    button.textContent = "Erro ao copiar";
  }

  window.setTimeout(() => {
    button.textContent = originalText;
  }, 1600);
};

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
  syncFiltersToURL();
};

// Cards are rendered after the initial parse, so scroll to deep links manually.
const scrollToHash = () => {
  if (!window.location.hash) return;

  let target;
  try {
    target = document.getElementById(
      decodeURIComponent(window.location.hash.slice(1)),
    );
  } catch {
    return;
  }

  window.requestAnimationFrame(() => {
    target?.scrollIntoView({ block: "start" });
  });
};

const revealItem = (id) => {
  const target = document.getElementById(`item-${id}`);
  if (!target) return;

  const url = new URL(window.location.href);
  url.hash = `item-${id}`;

  try {
    window.history.replaceState(null, "", url.toString());
  } catch {
    // Best-effort only: file:// previews cannot update the history state.
  }

  target.classList.add("card--highlight");
  window.setTimeout(() => target.classList.remove("card--highlight"), 1800);

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  target.scrollIntoView({
    behavior: reduceMotion ? "auto" : "smooth",
    block: "start",
  });
};

const surpriseMe = () => {
  const status = document.getElementById("wishlist-status");
  const items = applyFilters(getData());

  if (items.length === 0) {
    if (status) status.textContent = "Não há itens para escolher.";
    return;
  }

  const item = items[Math.floor(Math.random() * items.length)];
  if (status) status.textContent = `Item aleatório: ${item.title}`;
  revealItem(item.id);
};

document.addEventListener("DOMContentLoaded", () => {
  const filtersContainer = document.getElementById("filters-container");
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");
  const grid = document.getElementById("wishlist-grid");

  // Initialize theme and restore filters from the URL
  initTheme(themeToggle, themeIcon);
  hydrateFiltersFromURL();

  // Render filters
  renderFilters(filtersContainer, getData());
  const searchInput = document.getElementById("wishlist-search");

  const resetAndRefresh = () => {
    resetFilters();
    if (searchInput) searchInput.value = "";
    refreshWishlist();
  };

  // Search input
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      setSearchQuery(searchInput.value);
      refreshWishlist();
    });

    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && searchInput.value) {
        e.preventDefault();
        searchInput.value = "";
        setSearchQuery("");
        refreshWishlist();
      }
    });
  }

  // Press "/" anywhere outside a field to focus the search input.
  document.addEventListener("keydown", (e) => {
    if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey || !searchInput) {
      return;
    }

    const target = e.target;
    const isTyping =
      target instanceof HTMLElement &&
      (target.matches("input, textarea, select") || target.isContentEditable);
    if (isTyping) return;

    e.preventDefault();
    searchInput.focus();
    searchInput.select();
  });

  // Filter event listeners
  filtersContainer.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;

    const filter = btn.dataset.filter;
    const value = btn.dataset.value;

    if (btn.id === "random-item") {
      surpriseMe();
      return;
    } else if (btn.id === "reset-filters" || filter === "reset") {
      resetAndRefresh();
      return;
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

  // Empty-state reset and per-card sharing
  grid.addEventListener("click", (e) => {
    if (e.target.closest(".grid-message-action")) {
      resetAndRefresh();
      return;
    }

    const shareButton = e.target.closest("[data-share-id]");
    if (shareButton) shareItem(shareButton);
  });

  // Initial render
  refreshWishlist();
  scrollToHash();
});
