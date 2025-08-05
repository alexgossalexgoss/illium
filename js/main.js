document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("map-wrapper");
  const vignetteView = document.getElementById("vignette-view");
  const vignetteImage = document.getElementById("vignette-image");
  const closeBtn = document.getElementById("close-vignette");

  // Reset saved states so all icons start unvisited
  localStorage.removeItem("poiStates");

  let poiStates = {};
  let lastHighlighted = null;

  fetch("pois.json")
    .then(res => res.json())
    .then(pois => {
      pois.forEach(poi => {
        // Initialize state
        poiStates[poi.id] = { highlighted: false, visited: false };

        // Create POI icon
        const icon = document.createElement("img");
        icon.src = poi.icon;
        icon.dataset.id = poi.id;
        icon.classList.add("poi-icon", "unvisited");
        icon.style.left = poi.x + "%";
        icon.style.top = poi.y + "%";

        // Create label
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

        // Handle click
        icon.addEventListener("click", () => {
          const state = poiStates[poi.id];

          // First click → highlight
          if (!state.highlighted) {
            if (lastHighlighted && lastHighlighted !== icon) {
              lastHighlighted.classList.remove("highlighted");
              
              // If it was never visited, mark it unvisited again
              if (!poiStates[lastHighlighted.dataset.id].visited) {
                lastHighlighted.classList.add("unvisited");
              } else {
                lastHighlighted.classList.add("visited");
              }

              const lastLabel = container.querySelector(
                `.poi-label[data-id="${lastHighlighted.dataset.id}"]`
              );
              if (lastLabel) lastLabel.style.display = "none";

              poiStates[lastHighlighted.dataset.id].highlighted = false;
            }


            icon.classList.remove("unvisited", "visited");
            icon.classList.add("highlighted");
            label.style.display = "block";
            state.highlighted = true;
            lastHighlighted = icon;

          } else {
            // Second click → open vignette
            vignetteImage.src = poi.vignette;
            vignetteView.classList.add("active");
            vignetteView.dataset.currentPoi = poi.id;

            document.getElementById("map-wrapper").classList.add("blurred");
            document.getElementById("map-wrapper").style.pointerEvents = "none";
          }
        });
      });

      // Close vignette → mark visited
      closeBtn.addEventListener("click", () => {
        vignetteView.classList.remove("active");
        vignetteImage.src = "";

        document.getElementById("map-wrapper").classList.remove("blurred");
        document.getElementById("map-wrapper").style.pointerEvents = "auto";

        const id = vignetteView.dataset.currentPoi;
        if (id && poiStates[id]) {
          const icon = container.querySelector(`.poi-icon[data-id="${id}"]`);
          const label = container.querySelector(`.poi-label[data-id="${id}"]`);

          if (icon) {
            icon.classList.remove("highlighted", "unvisited");
            icon.classList.add("visited");
          }
          if (label) label.style.display = "none";

          poiStates[id].highlighted = false;
          poiStates[id].visited = true;
          localStorage.setItem("poiStates", JSON.stringify(poiStates));
        }
      });
    });

  // Reset button
  document.getElementById("reset-progress").addEventListener("click", () => {
    localStorage.removeItem("poiStates");
    location.reload();
  });
});
