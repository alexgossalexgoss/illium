import { getEls } from './dom.js';
import { state, save } from './state.js';

/**
 * Ensure a title at the top of the vignette image and a blurb at the bottom.
 * We create the nodes once and reuse them on subsequent opens.
 */
function injectTitleBlurb(title, blurb) {
  const els = getEls();
  let titleEl = document.getElementById('vignette-title');
  let blurbEl = document.getElementById('vignette-blurb');

  if (!titleEl) {
    titleEl = document.createElement('h2');
    titleEl.id = 'vignette-title';
    // Title sits above the image
    els.vignetteWrapper.prepend(titleEl);
  }
  if (!blurbEl) {
    blurbEl = document.createElement('p');
    blurbEl.id = 'vignette-blurb';
    // Blurb sits below the image
    els.vignetteWrapper.appendChild(blurbEl);
  }

  titleEl.textContent = title || '';
  blurbEl.textContent = blurb || '';
}

export function openVignette(poi) {
  const els = getEls();
  els.vignetteImage.src = poi.vignette || '';
  els.vignetteView.classList.remove('hidden');
  els.vignetteView.classList.add('active');
  els.vignetteView.dataset.currentPoi = poi.id;

  const content = poi.content?.[state.visitorClass] || {};
  injectTitleBlurb(content.title, content.blurb);

  els.container.classList.add('blurred');
  els.container.style.pointerEvents = 'none';
}

let unlockHandler = null;
export function onUnlock(handler) {
  unlockHandler = handler;
}

export async function closeVignetteAndMaybeUnlock() {
  const els = getEls();

  // Hide vignette
  els.vignetteView.classList.remove('active');
  els.vignetteView.classList.add('hidden');
  els.vignetteImage.src = '';

  // Unblur / re-enable map
  els.container.classList.remove('blurred');
  els.container.style.pointerEvents = 'auto';

  // Which POI did we just view?
  const id = els.vignetteView.dataset.currentPoi;
  delete els.vignetteView.dataset.currentPoi;

  // Mark POI as visited in state and UI
  if (id && state.poiStates?.[id]) {
    const elBundle = state.poiElements?.[id];
    if (elBundle) {
      const { icon, label } = elBundle;
      if (icon) {
        icon.classList.remove('highlighted', 'unvisited');
        icon.classList.add('visited');
      }
      if (label) {
        label.style.display = 'none';
      }
    }
    state.poiStates[id].highlighted = false;
    state.poiStates[id].visited = true;
    if (state.lastHighlighted && state.lastHighlighted.dataset?.id === id) {
      state.lastHighlighted = null;
    }
    save();
  }

  // If class has been chosen and we haven't unlocked yet, unlock now (first close)
  if (!state.hasUnlockedPOIs && state.visitorClass) {
    state.hasUnlockedPOIs = true;
    save();
    if (typeof unlockHandler === 'function') {
      await unlockHandler();
    }
  }
}
