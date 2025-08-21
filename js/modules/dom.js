export function getEls() {
  return {
    container: document.getElementById('map-wrapper'),
    vignetteView: document.getElementById('vignette-view'),
    vignetteImage: document.getElementById('vignette-image'),
    vignetteWrapper: document.getElementById('vignette-wrapper'),
    closeVignetteBtn: document.getElementById('close-vignette'),
    resetBtn: document.getElementById('reset-progress'),
    fullscreenBtn: document.getElementById('fullscreen-btn'),
    poiContainer: document.getElementById('poi-container'),
  };
}
