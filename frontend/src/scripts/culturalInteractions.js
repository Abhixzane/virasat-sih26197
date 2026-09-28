/**
 * ==============================================================================
 * VIRASAT — Core JavaScript Cultural Interactions Engine (ES6 Module)
 * Pure JavaScript: Scroll Progress, Ripple Effects, Scroll Reveal & Web Audio Chimes
 * ==============================================================================
 */

/**
 * Initializes the reading scroll progress bar at the top of the browser window.
 */
export function initScrollProgressBar() {
  let progressBar = document.getElementById('virasat-scroll-progress');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.id = 'virasat-scroll-progress';
    document.body.appendChild(progressBar);
  }

  const updateProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (scrollHeight > 0) {
      const progressPercent = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
      progressBar.style.width = `${progressPercent}%`;
    }
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

/**
 * Injects and manages the floating Back-to-Top button.
 */
export function initBackToTop() {
  let backBtn = document.getElementById('virasat-back-to-top');
  if (!backBtn) {
    backBtn = document.createElement('button');
    backBtn.id = 'virasat-back-to-top';
    backBtn.setAttribute('aria-label', 'Scroll to top of cultural dossier');
    backBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="m18 15-6-6-6 6"/>
      </svg>
    `;
    document.body.appendChild(backBtn);

    backBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const toggleBackBtn = () => {
    if (window.scrollY > 350) {
      backBtn.classList.add('visible');
    } else {
      backBtn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', toggleBackBtn, { passive: true });
  toggleBackBtn();
}

/**
 * Attaches pure JavaScript click ripples to interactive cards and buttons.
 */
export function initRippleEffects() {
  document.addEventListener('click', (e) => {
    const target = e.target.closest('.virasat-ripple, button');
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const circle = document.createElement('span');
    const diameter = Math.max(rect.width, rect.height);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - radius}px`;
    circle.style.top = `${e.clientY - rect.top - radius}px`;
    circle.classList.add('virasat-ripple-span');

    const existingRipple = target.querySelector('.virasat-ripple-span');
    if (existingRipple) {
      existingRipple.remove();
    }

    target.appendChild(circle);
    setTimeout(() => {
      circle.remove();
    }, 600);
  });
}

/**
 * Pure JavaScript Web Audio API Synth:
 * Generates an organic, authentic Indian temple bell / tanpura harmonic resonance.
 * Zero external mp3 dependencies — works instantly in all modern browsers.
 */
let audioCtx = null;

export function playCulturalChime(frequency = 528) {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    // Harmonics: 528 Hz (Love/Healing frequency) or traditional Sa-Pa harmonics
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, audioCtx.currentTime + 0.8);

    // Warm bell envelope: quick attack, smooth exponential decay
    gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.18, audioCtx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 1.2);
  } catch (err) {
    console.debug('Web Audio API chime played silently:', err);
  }
}

/**
 * Initializes IntersectionObserver to trigger smooth entry animations for sections.
 */
export function initScrollRevealObserver() {
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  const elements = document.querySelectorAll('.reveal-on-scroll:not(.is-revealed)');
  elements.forEach((el) => observer.observe(el));
}
