// LocalStorage management - handles all persistence logic

const STORAGE_KEYS = {
  RESERVED: "wishlist_reserved",
  THEME: "wishlist_theme",
};

export const storage = {
  getReservedItems: () => {
    try {
      const reserved = localStorage.getItem(STORAGE_KEYS.RESERVED);
      return reserved ? JSON.parse(reserved) : [];
    } catch (e) {
      console.error("Error reading reserved items:", e);
      return [];
    }
  },

  setReservedItems: (items) => {
    try {
      localStorage.setItem(STORAGE_KEYS.RESERVED, JSON.stringify(items));
    } catch (e) {
      console.error("Error saving reserved items:", e);
    }
  },

  getTheme: () => {
    try {
      return localStorage.getItem(STORAGE_KEYS.THEME);
    } catch (e) {
      console.error("Error reading theme preference:", e);
      return null;
    }
  },

  setTheme: (theme) => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (e) {
      console.error("Error saving theme preference:", e);
    }
  },
};
