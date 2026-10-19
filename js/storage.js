// LocalStorage management - handles all persistence logic

const STORAGE_KEYS = {
  THEME: "wishlist_theme",
};

export const storage = {
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
