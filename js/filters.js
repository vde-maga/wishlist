// Filter system - manages all filtering and sorting logic

import { parsePrice, PRICE_TIERS } from "./utils.js";

// Filter state
let activeFilters = {
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
    activeFilters.tags.length > 0 ||
    activeFilters.priority !== null ||
    activeFilters.priceRange !== null ||
    sortOrder !== null
  );
};
