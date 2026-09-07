// Utility functions - pure functions with no side effects

export const escapeHTML = (str) => {
  if (typeof str !== "string") return str;
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
};

export const formatPrice = (price) => {
  if (!price) return "";
  return escapeHTML(price);
};

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};
