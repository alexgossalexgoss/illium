import { refs } from "./refs.js";
import { loadState, saveState, clearState } from "./state.js";
import { POIS } from "./pois.js";
import { renderPOIs } from "./render.js";
import { wireInteractions } from "./interactions.js";
import { setupVignette } from "./vignette.js";
import { setupFullscreen } from "./fullscreen.js";
import { setupResizeSync } from "./resize.js";


export function initApp() {
const r = refs();
const state = loadState();


// Initial render
renderPOIs({ container: r.poiContainer, pois: POIS, state });


// Global wiring
setupVignette({ state, refs: r });
wireInteractions({ state, refs: r, pois: POIS, onState: saveState });
setupFullscreen({ btn: r.fullscreenBtn });
setupResizeSync({ img: r.mapImage, container: r.poiContainer });


// Reset progress
if (r.resetBtn) {
r.resetBtn.addEventListener("click", () => {
clearState();
location.reload();
});
}
}