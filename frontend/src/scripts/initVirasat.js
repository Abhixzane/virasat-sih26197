/**
 * ==============================================================================
 * VIRASAT — Main JavaScript Frontend Bootstrapper
 * Boots scroll progress, back-to-top button, ripple effects, audio synthesis & theme
 * ==============================================================================
 */

import {
  initScrollProgressBar,
  initBackToTop,
  initRippleEffects,
  initScrollRevealObserver,
  playCulturalChime
} from './culturalInteractions.js';
import { themeManager } from './themeManager.js';

export function bootstrapVirasatJS() {
  if (typeof window === 'undefined') return;

  // Initialize interactive features
  initScrollProgressBar();
  initBackToTop();
  initRippleEffects();
  initScrollRevealObserver();
  themeManager.init();

  // Expose global JavaScript helpers on window for inline / debug / component use
  window.VirasatJS = {
    playChime: playCulturalChime,
    scrollToTop: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
    theme: themeManager,
    version: '2.0.0-js'
  };

  console.log('🏛️ VIRASAT Pure JavaScript & CSS Interaction Suite Active');
}
