// Filter system - manages all filtering and sorting logic

import { normalizeText, parsePrice, PRICE_TIERS } from "./utils.js";

const VALID_PRIORITIES = new Set(["high", "medium", "low"]);
const VALID_PRICE_RANGES = new Set(["low", "medium", "high"]);
const VALID_SORT_ORDERS = new Set(["price-asc", "price-desc"]);
const MAX_SEARCH_LENGTH = 100;

// Filter state
let activeFilters = {
  search: "",
  tags: [],
  priority: null,
  priceRange: null,
};

let sortOrder = null; // 'price-asc' or 'price-desc'

// Extract unique tags from data
export const getUniqueTags = (data) => {
  const tags = new Set();
  data.forEach((item) => {
    if (Array.isArray(item.tags)) {
      item.tags.forEach((tag) => tags.add(tag));
    }
  });
  return Array.from(tags).sort();
};

// Apply filters to data
export const applyFilters = (data) => {
  let filtered = [...data];

  // Search matches title, description and tags. Every term must be present.
  const query = normalizeText(activeFilters.search).trim();
  if (query) {
    const terms = query.split(/\s+/).filter(Boolean);
    filtered = filtered.filter((item) => {
      const tags = Array.isArray(item.tags) ? item.tags : [];
      const haystack = normalizeText(
        [item.title, item.description, ...tags].filter(Boolean).join(" "),
      );
      return terms.every((term) => haystack.includes(term));
    });
  }

  // Filter by tags
  if (activeFilters.tags.length > 0) {
    filtered = filtered.filter(
      (item) =>
        Array.isArray(item.tags) &&
        activeFilters.tags.some((tag) => item.tags.includes(tag)),
    );
  }

  // Filter by priority
  if (activeFilters.priority) {
    filtered = filtered.filter(
      (item) => item.priority === activeFilters.priority,
    );
  }

  // Filter by price range.
  // Items without a valid price are always kept so that selecting a price
  // tier never silently hides items that simply have no price set.
  if (activeFilters.priceRange) {
    const tier = PRICE_TIERS[activeFilters.priceRange];
    if (tier) {
      filtered = filtered.filter((item) => {
        const price = parsePrice(item.price);
        if (isNaN(price)) return true;
        return tier(price);
      });
    }
  }

  // Sort by price. Items without a price are always pushed to the end.
  if (sortOrder) {
    const direction = sortOrder === "price-asc" ? 1 : -1;
    filtered.sort((a, b) => {
      const priceA = parsePrice(a.price);
      const priceB = parsePrice(b.price);
      const hasA = !isNaN(priceA);
      const hasB = !isNaN(priceB);
      if (!hasA && !hasB) return 0;
      if (!hasA) return 1;
      if (!hasB) return -1;
      return (priceA - priceB) * direction;
    });
  }

  return filtered;
};

// Set free-text search
export const setSearchQuery = (query) => {
  activeFilters.search = String(query ?? "").slice(0, MAX_SEARCH_LENGTH);
};

// Toggle tag filter
export const toggleTagFilter = (tag) => {
  const index = activeFilters.tags.indexOf(tag);
  if (index > -1) {
    activeFilters.tags.splice(index, 1);
  } else {
    activeFilters.tags.push(tag);
  }
};

// Set priority filter
export const setPriorityFilter = (priority) => {
  activeFilters.priority =
    activeFilters.priority === priority ? null : priority;
};

// Set price range filter
export const setPriceRangeFilter = (range) => {
  activeFilters.priceRange = activeFilters.priceRange === range ? null : range;
};

// Set sort order
export const setSortOrder = (order) => {
  sortOrder = sortOrder === order ? null : order;
};

// Reset all filters
export const resetFilters = () => {
  activeFilters = {
    search: "",
    tags: [],
    priority: null,
    priceRange: null,
  };
  sortOrder = null;
};

// Get current filter state
export const getFilterState = () => ({
  ...activeFilters,
  sortOrder,
});

// Whether any filter or sort is currently active
export const hasActiveFilter = () => {
  return (
    activeFilters.search.trim().length > 0 ||
    activeFilters.tags.length > 0 ||
    activeFilters.priority !== null ||
    activeFilters.priceRange !== null ||
    sortOrder !== null
  );
};

// Restore filter state from the query string so URLs are shareable.
export const hydrateFiltersFromURL = () => {
  const params = new URLSearchParams(window.location.search);
  const tags = (params.get("tags") || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  const priority = params.get("priority");
  const priceRange = params.get("price");
  const sort = params.get("sort");

  activeFilters = {
    search: (params.get("q") || "").slice(0, MAX_SEARCH_LENGTH),
    tags: [...new Set(tags)],
    priority: VALID_PRIORITIES.has(priority) ? priority : null,
    priceRange: VALID_PRICE_RANGES.has(priceRange) ? priceRange : null,
  };
  sortOrder = VALID_SORT_ORDERS.has(sort) ? sort : null;
};

// Keep the URL in sync without adding browser history entries.
export const syncFiltersToURL = () => {
  const params = new URLSearchParams();
  const search = activeFilters.search.trim();

  if (search) params.set("q", search);
  if (activeFilters.tags.length > 0)
    params.set("tags", activeFilters.tags.join(","));
  if (activeFilters.priority) params.set("priority", activeFilters.priority);
  if (activeFilters.priceRange) params.set("price", activeFilters.priceRange);
  if (sortOrder) params.set("sort", sortOrder);

  const url = new URL(window.location.href);
  const query = params.toString();
  url.search = query ? `?${query}` : "";

  try {
    window.history.replaceState(null, "", url.toString());
  } catch {
    // Best-effort only: file:// previews cannot update the history state.
  }
};
