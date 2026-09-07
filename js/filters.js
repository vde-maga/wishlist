// Filter system - manages all filtering and sorting logic

import { isReserved } from "./reservation.js";

// Filter state
let activeFilters = {
  tags: [],
  priority: null,
  priceRange: null,
  reserved: null,
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

  // Filter by price range
  if (activeFilters.priceRange) {
    filtered = filtered.filter((item) => {
      if (!item.price) return false;
      const price = parseFloat(item.price.replace(/[^\d.]/g, ""));
      if (isNaN(price)) return false;

      switch (activeFilters.priceRange) {
        case "low":
          return price < 50;
        case "medium":
          return price >= 50 && price < 150;
        case "high":
          return price >= 150;
        default:
          return true;
      }
    });
  }

  // Filter by reservation status
  if (activeFilters.reserved !== null) {
    filtered = filtered.filter((item) => {
      const reserved = isReserved(item.id);
      return activeFilters.reserved === "reserved" ? reserved : !reserved;
    });
  }

  // Sort by price
  if (sortOrder) {
    filtered.sort((a, b) => {
      const priceA = parseFloat((a.price || "0").replace(/[^\d.]/g, "")) || 0;
      const priceB = parseFloat((b.price || "0").replace(/[^\d.]/g, "")) || 0;
      return sortOrder === "price-asc" ? priceA - priceB : priceB - priceA;
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

// Set reservation filter
export const setReservedFilter = (status) => {
  activeFilters.reserved = activeFilters.reserved === status ? null : status;
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
    reserved: null,
  };
  sortOrder = null;
};

// Get current filter state
export const getFilterState = () => ({
  ...activeFilters,
  sortOrder,
});
