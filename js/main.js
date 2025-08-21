function toggleFullscreen() {
  if (
    document.fullscreenElement || 
    document.webkitFullscreenElement || 
    document.msFullscreenElement
  ) {
    // ✅ EXIT fullscreen
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  } else {
    // ✅ ENTER fullscreen
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  }
}



document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("map-wrapper");
  const vignetteView = document.getElementById("vignette-view");
  const vignetteImage = document.getElementById("vignette-image");
  const closeBtn = document.getElementById("close-vignette");

  let poiStates = {};
  let poiElements = {};
  let lastHighlighted = null;
  let visitorClass = null;
  let hasUnlockedPOIs = false;

 fetch("pois.json")
    .then(res => res.json())
    .then(pois => {
      pois.forEach(poi => {
        // Only create visible POIs initially
        if (!poi.visible) return;

        const icon = document.createElement("img");
        icon.src = poi.icon;
        icon.dataset.id = poi.id;
        icon.classList.add("poi-icon", "unvisited");
        icon.style.left = poi.x + "%";
        icon.style.top = poi.y + "%";

        const label = document.createElement("div");
        label.classList.add("poi-label");
        label.dataset.id = poi.id;
        label.textContent = poi.name;
        label.style.left = poi.x + "%";
        label.style.top = poi.y - 5 + "%";
        label.style.display = "none";
        label.style.transform = "translate(-50%, -50%)";

        container.appendChild(icon);
        container.appendChild(label);

        poiStates[poi.id] = { highlighted: false, visited: false };
        poiElements[poi.id] = { icon, label, data: poi };

        icon.addEventListener("click", () => {
          const state = poiStates[poi.id];
          const isStartingPOI = poi.id === "poi1" || poi.id === "poi2";

          // First click → highlight
          if (!state.highlighted) {
            if (lastHighlighted && lastHighlighted !== icon) {
              const lastId = lastHighlighted.dataset.id;
              const lastState = poiStates[lastId];
              lastHighlighted.classList.remove("highlighted");
              if (!lastState.visited) {
                lastHighlighted.classList.add("unvisited");
              } else {
                lastHighlighted.classList.add("visited");
              }
              poiElements[lastId].label.style.display = "none";
              lastState.highlighted = false;
            }

            icon.classList.remove("unvisited", "visited");
            icon.classList.add("highlighted");
            label.style.display = "block";
            state.highlighted = true;
            lastHighlighted = icon;
          }

          // Second click → either class selection or open vignette
          else {
            if (!visitorClass && isStartingPOI) {
              // Set class based on which POI was clicked
              visitorClass = poi.id === "poi1" ? "manager" : "worker";
            }

            if (visitorClass) {
              vignetteImage.src = poi.vignette;
              vignetteView.classList.add("active");
              vignetteView.dataset.currentPoi = poi.id;

              const title = poi.content?.[visitorClass]?.title || "";
              const blurb = poi.content?.[visitorClass]?.blurb || "";

              document.getElementById("map-wrapper").classList.add("blurred");
              document.getElementById("map-wrapper").style.pointerEvents = "none";

              // Inject title & blurb content
              let titleEl = document.getElementById("vignette-title");
              let blurbEl = document.getElementById("vignette-blurb");
              if (!titleEl) {
                titleEl = document.createElement("h2");
                titleEl.id = "vignette-title";
                vignetteView.querySelector("#vignette-wrapper").prepend(titleEl);
              }
              if (!blurbEl) {
                blurbEl = document.createElement("p");
                blurbEl.id = "vignette-blurb";
                vignetteView.querySelector("#vignette-wrapper").appendChild(blurbEl);
              }
              titleEl.textContent = title;
              blurbEl.textContent = blurb;
            }
          }
        });
      });

      closeBtn.addEventListener("click", () => {
        vignetteView.classList.remove("active");
        vignetteImage.src = "";

        document.getElementById("map-wrapper").classList.remove("blurred");
        document.getElementById("map-wrapper").style.pointerEvents = "auto";

        const id = vignetteView.dataset.currentPoi;
        if (id && poiStates[id]) {
          const icon = poiElements[id].icon;
          const label = poiElements[id].label;

          icon.classList.remove("highlighted", "unvisited");
          icon.classList.add("visited");
          label.style.display = "none";

          poiStates[id].highlighted = false;
          poiStates[id].visited = true;

          // Reveal rest of the map if this is the first vignette and class is set
          if (!hasUnlockedPOIs && visitorClass && (id === "poi1" || id === "poi2")) {
            hasUnlockedPOIs = true;
            fetch("pois.json")
              .then(res => res.json())
              .then(pois => {
                pois.forEach(poi => {
                  if (poi.visible) return; // Already shown
                  const icon = document.createElement("img");
                  icon.src = poi.icon;
                  icon.dataset.id = poi.id;
                  icon.classList.add("poi-icon", "unvisited");
                  icon.style.left = poi.x + "%";
                  icon.style.top = poi.y + "%";

                  const label = document.createElement("div");
                  label.classList.add("poi-label");
                  label.dataset.id = poi.id;
                  label.textContent = poi.name;
                  label.style.left = poi.x + "%";
                  label.style.top = poi.y - 5 + "%";
                  label.style.display = "none";
                  label.style.transform = "translate(-50%, -50%)";

                  container.appendChild(icon);
                  container.appendChild(label);

                  poiStates[poi.id] = { highlighted: false, visited: false };
                  poiElements[poi.id] = { icon, label, data: poi };

                  icon.addEventListener("click", () => {
                    const state = poiStates[poi.id];
                    if (!state.highlighted) {
                      if (lastHighlighted && lastHighlighted !== icon) {
                        const lastId = lastHighlighted.dataset.id;
                        const lastState = poiStates[lastId];
                        lastHighlighted.classList.remove("highlighted");
                        if (!lastState.visited) {
                          lastHighlighted.classList.add("unvisited");
                        } else {
                          lastHighlighted.classList.add("visited");
                        }
                        poiElements[lastId].label.style.display = "none";
                        lastState.highlighted = false;
                      }

                      icon.classList.remove("unvisited", "visited");
                      icon.classList.add("highlighted");
                      label.style.display = "block";
                      state.highlighted = true;
                      lastHighlighted = icon;
                    } else {
                      if (visitorClass) {
                        vignetteImage.src = poi.vignette;
                        vignetteView.classList.add("active");
                        vignetteView.dataset.currentPoi = poi.id;

                        const title = poi.content?.[visitorClass]?.title || "";
                        const blurb = poi.content?.[visitorClass]?.blurb || "";

                        let titleEl = document.getElementById("vignette-title");
                        let blurbEl = document.getElementById("vignette-blurb");
                        if (!titleEl) {
                          titleEl = document.createElement("h2");
                          titleEl.id = "vignette-title";
                          vignetteView.querySelector("#vignette-wrapper").prepend(titleEl);
                        }
                        if (!blurbEl) {
                          blurbEl = document.createElement("p");
                          blurbEl.id = "vignette-blurb";
                          vignetteView.querySelector("#vignette-wrapper").appendChild(blurbEl);
                        }
                        titleEl.textContent = title;
                        blurbEl.textContent = blurb;

                        document.getElementById("map-wrapper").classList.add("blurred");
                        document.getElementById("map-wrapper").style.pointerEvents = "none";
                      }
                    }
                  });
                });
              });
          }
        }
      });
  });

  document.getElementById("reset-progress").addEventListener("click", () => {
    localStorage.removeItem("poiStates");
    location.reload();
  });

  document.getElementById("fullscreen-btn").addEventListener("click", () => {
    toggleFullscreen();
  });
});
