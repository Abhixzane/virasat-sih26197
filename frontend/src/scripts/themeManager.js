/**
 * ==============================================================================
 * VIRASAT — JavaScript Theme & Accessibility Manager (ES6 Module)
 * Dynamic high-contrast toggle, font sizing, and visual comfort settings
 * ==============================================================================
 */

const THEME_STORAGE_KEY = 'virasat_theme_prefs';

export const themeManager = {
  getPreferences() {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      return saved ? JSON.parse(saved) : { highContrast: false, fontSize: 'normal' };
    } catch {
      return { highContrast: false, fontSize: 'normal' };
    }
  },

  setHighContrast(enabled) {
    const prefs = this.getPreferences();
    prefs.highContrast = enabled;
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(prefs));
    this.applyPreferences();
  },

  applyPreferences() {
    const prefs = this.getPreferences();
    if (prefs.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  },

  init() {
    this.applyPreferences();
  }
};
