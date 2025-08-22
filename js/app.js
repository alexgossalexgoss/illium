import { toggleFullscreen } from './modules/fullscreen.js';
import { getEls } from './modules/dom.js';
import { loadPOIs } from './modules/pois.js';
import { renderPOIs } from './modules/render.js';
import { openVignette, closeVignetteAndMaybeUnlock } from './modules/vignette.js';
import { state } from './modules/state.js';

document.addEventListener('DOMContentLoaded', async () => {
  const els = getEls();

  // 🔑 Inject visitor class from splash
  state.visitorClass = window.__assignedRole || 'manager';

  // Render all POIs immediately
  const pois = await loadPOIs();
  renderPOIs(pois);

  // Handlers
  els.fullscreenBtn.addEventListener('click', toggleFullscreen);
  els.resetBtn.addEventListener('click', () => {
    localStorage.removeItem('poiStates');
    location.reload();
  });

  els.closeVignetteBtn.addEventListener('click', async () => {
    await closeVignetteAndMaybeUnlock();
  });
});

// expose vignette opener for renderer callbacks
export { openVignette } from './modules/vignette.js';
