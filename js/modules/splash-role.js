(function () {
  // Run after DOM is ready (covers both normal and <script defer> cases)
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

  function init() {
    var splash = document.getElementById("splash");
    var txt    = document.getElementById("splashText");
    var btn    = document.getElementById("splashBtn");

    // Coin flip (allow ?role=manager|worker for testing)
    var urlRole = new URLSearchParams(location.search).get("role");
    var role = (urlRole === "manager" || urlRole === "worker")
      ? urlRole
      : (Math.random() < 0.5 ? "manager" : "worker");

    if (txt) txt.textContent = "You are a " + role + ".";

    // Expose for modules that care (optional)
    window.__assignedRole = role;

    function proceed() {
      if (splash) splash.classList.add("hidden");
      // Let modules know we’re ready to render POIs
      document.dispatchEvent(
        new CustomEvent("splash:proceed", { detail: { role: role } })
      );
    }

    // Button click
    if (btn) btn.addEventListener("click", proceed, { once: true });

    // Click the dark backdrop to continue (but not clicks inside the card)
    if (splash) {
      splash.addEventListener("click", function (e) {
        if (e.target === splash) proceed();
      });
    }
  }
})();
