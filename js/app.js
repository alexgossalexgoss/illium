import { toggleFullscreen } from './modules/fullscreen.js';
import { getEls } from './modules/dom.js';
import { loadPOIs } from './modules/pois.js';
import { renderPOIs, attachUnlockHandler } from './modules/render.js';
import { openVignette, closeVignetteAndMaybeUnlock } from './modules/vignette.js';
import { state } from './modules/state.js';

document.addEventListener('DOMContentLoaded', async () => {
  const els = getEls();
  // initial load: only visibly flagged POIs
  const pois = await loadPOIs({ visibleOnly: true });
  renderPOIs(pois);

  // handlers
  els.fullscreenBtn.addEventListener('click', toggleFullscreen);
  els.resetBtn.addEventListener('click', () => {
    localStorage.removeItem('poiStates');
    location.reload();
  });

  els.closeVignetteBtn.addEventListener('click', async () => {
    await closeVignetteAndMaybeUnlock();
  });

  // allow renderer to request unlock when appropriate
  attachUnlockHandler(async () => {
    const more = await loadPOIs({ visibleOnly: false, excludeVisible: true });
    renderPOIs(more);
  });
});

// expose vignette opener for renderer callbacks
export { openVignette } from './modules/vignette.js';
