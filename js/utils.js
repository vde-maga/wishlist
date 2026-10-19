// Utility functions - pure functions with no side effects

export const escapeHTML = (str) => {
  if (typeof str !== "string") return str;
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

// Parse a price string into a number.
// Handles ranges ("1 a 10€" -> 1), single values ("38€" -> 38)
// and non-EUR suffixes ("3$/mo" -> 3). Returns NaN when unparseable.
export const parsePrice = (price) => {
  if (price === null || price === undefined) return NaN;
  const match = String(price).match(/\d+(?:[.,]\d+)?/);
  if (!match) return NaN;
  return parseFloat(match[0].replace(",", "."));
};

// Only allow safe link schemes (http, https, mailto) to prevent
// javascript:/data: URLs from being rendered into href attributes.
export const sanitizeURL = (url) => {
  if (typeof url !== "string") return "";
  try {
    const parsed = new URL(url, window.location.origin);
    if (["http:", "https:", "mailto:"].includes(parsed.protocol)) {
      return parsed.href;
    }
  } catch {
    return "";
  }
  return "";
};

// Price tiers used by the filter system (euros).
export const PRICE_TIERS = {
  low: (value) => value < 50,
  medium: (value) => value >= 50 && value < 150,
  high: (value) => value >= 150,
};
