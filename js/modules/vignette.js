import { getEls } from './dom.js';
import { state, save } from './state.js';

function injectTitleBlurb(title, blurb) {
  const els = getEls();
  let titleEl = document.getElementById('vignette-title');
  let blurbEl = document.getElementById('vignette-blurb');
  if (!titleEl) {
    titleEl = document.createElement('h2');
    titleEl.id = 'vignette-title';
    els.vignetteWrapper.prepend(titleEl);
  }
  if (!blurbEl) {
    blurbEl = document.createElement('p');
    blurbEl.id = 'vignette-blurb';
    els.vignetteWrapper.appendChild(blurbEl);
  }
  titleEl.textContent = title || '';
  blurbEl.textContent = blurb || '';
}

export function openVignette(poi) {
  const els = getEls();
  els.vignetteImage.src = poi.vignette;
  els.vignetteView.classList.add('active');
  els.vignetteView.dataset.currentPoi = poi.id;

  const content = poi.content?.[state.visitorClass] || {};
  injectTitleBlurb(content.title, content.blurb);

  getEls().container.classList.add('blurred');
  getEls().container.style.pointerEvents = 'none';
}

let unlockHandler = null;
export function onUnlock(handler) {
  unlockHandler = handler;
}

export async function closeVignetteAndMaybeUnlock() {
  const els = getEls();
  els.vignetteView.classList.remove('active');
  els.vignetteImage.src = '';

  els.container.classList.remove('blurred');
  els.container.style.pointerEvents = 'auto';

  const id = els.vignetteView.dataset.currentPoi;
  if (id && state.poiStates[id]) {
    const icon = state.poiElements[id].icon;
    const label = state.poiElements[id].label;

    icon.classList.remove('highlighted', 'unvisited');
    icon.classList.add('visited');
    label.style.display = 'none';

    state.poiStates[id].highlighted = false;
    state.poiStates[id].visited = true;
    save();

    // If first vignette & starting class selected, unlock the rest
    if (!state.hasUnlockedPOIs && state.visitorClass && (id === 'poi1' || id === 'poi2')) {
      state.hasUnlockedPOIs = true;
      save();
      if (typeof unlockHandler === 'function') {
        await unlockHandler();
      }
    }
  }
}
