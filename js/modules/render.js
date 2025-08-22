import { getEls } from './dom.js';
import { state, save } from './state.js';
import { openVignette, onUnlock } from './vignette.js';

export function attachUnlockHandler(handler) { onUnlock(handler); }

function setHighlight(icon, label, s) {
  icon.classList.remove('unvisited', 'visited');
  icon.classList.add('highlighted');
  label.style.display = 'block';
  s.highlighted = true;
  state.lastHighlighted = icon;
}

function clearHighlight(icon, label, s) {
  icon.classList.remove('highlighted', 'unvisited');
  icon.classList.add(s.visited ? 'visited' : 'unvisited');
  label.style.display = 'none';
  s.highlighted = false;
}

function handleIconClick(poi) {
  const { icon, label } = state.poiElements[poi.id];
  const s = state.poiStates[poi.id];
  const isStartingPOI = poi.id === 'poi1' || poi.id === 'poi2';

  return () => {
    // first click: highlight
    if (!s.highlighted) {
      if (state.lastHighlighted && state.lastHighlighted !== icon) {
        const lastId = state.lastHighlighted.dataset.id;
        const lastState = state.poiStates[lastId];
        const lastEl = state.poiElements[lastId];
        clearHighlight(state.lastHighlighted, lastEl.label, lastState);
      }
      setHighlight(icon, label, s);
      return;
    }
    // second click: set class (if needed) and open vignette
    if (!state.visitorClass && isStartingPOI) {
      state.visitorClass = poi.id === 'poi1' ? 'manager' : 'worker';
    }
    if (state.visitorClass) {
      openVignette(poi);
    }
  };
}

export function renderPOIs(pois) {
  const els = getEls();
  pois.forEach(poi => {
    // avoid double-rendering
    if (state.poiElements[poi.id]) return;

    const icon = document.createElement('img');
    icon.src = poi.icon;
    icon.dataset.id = poi.id;
    icon.classList.add('poi-icon', 'unvisited');
    icon.style.left = poi.x + '%';
    icon.style.top = poi.y + '%';

    const label = document.createElement('div');
    label.classList.add('poi-label');
    label.dataset.id = poi.id;
    label.textContent = poi.name;
    label.style.left = poi.x + '%';
    label.style.top = (poi.y - 5) + '%';
    label.style.display = 'none';
    label.style.transform = 'translate(-50%, -50%)';

    (els.poiContainer || els.container).appendChild(icon);
    (els.poiContainer || els.container).appendChild(label);

    state.poiStates[poi.id] = state.poiStates[poi.id] || { highlighted: false, visited: false };
    state.poiElements[poi.id] = { icon, label, data: poi };

    icon.addEventListener('click', handleIconClick(poi));
  });
  save();
}
