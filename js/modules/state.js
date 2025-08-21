const persisted = JSON.parse(localStorage.getItem('poiStates') || '{}');

export const state = {
  poiStates: persisted.poiStates || {},   // { [id]: { highlighted, visited } }
  poiElements: {},                        // { [id]: { icon, label, data } }
  lastHighlighted: null,
  visitorClass: null,                     // 'manager' | 'worker'
  hasUnlockedPOIs: persisted.hasUnlockedPOIs || false,
};

export function save() {
  localStorage.setItem('poiStates', JSON.stringify({
    poiStates: state.poiStates,
    hasUnlockedPOIs: state.hasUnlockedPOIs,
  }));
}
