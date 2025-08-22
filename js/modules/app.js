
import { toggleFullscreen } from './modules/fullscreen.js';
import { getEls } from './modules/dom.js';
import { loadPOIs } from './modules/pois.js';
import { renderPOIs, attachUnlockHandler } from './modules/render.js';
import { closeVignetteAndMaybeUnlock } from './modules/vignette.js';
import { state } from './modules/state.js';

document.addEventListener('DOMContentLoaded', async () => {
  const els = getEls();

  // Always attach UI handlers (even if POI load fails)
  els.fullscreenBtn?.addEventListener('click', toggleFullscreen);
  els.resetBtn?.addEventListener('click', () => {
    localStorage.removeItem('poiStates');
    location.reload();
  });
  els.closeVignetteBtn?.addEventListener('click', () => {
    closeVignetteAndMaybeUnlock();
  });

  // Initial render: show only the initially-visible POIs
  try {
    const initial = await loadPOIs({ visibleOnly: true });
    renderPOIs(initial);
  } catch (e) {
    console.warn('[Bootstrap] initial POIs failed', e);
  }

  // If a prior session already unlocked the rest, render them on first load
  try {
    if (state.hasUnlockedPOIs) {
      const more = await loadPOIs({ visibleOnly: false, excludeVisible: true });
      renderPOIs(more);
    }
  } catch (e) {
    console.warn('[Bootstrap] unlocked POIs on load failed', e);
  }

  // When the first vignette closes (and class is chosen), load & render the rest
  attachUnlockHandler(async () => {
    try {
      const more = await loadPOIs({ visibleOnly: false, excludeVisible: true });
      renderPOIs(more);
    } catch (e) {
      console.warn('[Unlock] loading additional POIs failed', e);
    }
  });
});
