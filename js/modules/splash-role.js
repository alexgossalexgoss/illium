(function () {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

  function init() {
    const splash = document.getElementById("splash");
    const txt = document.getElementById("splashText");
    const btn = document.getElementById("splashBtn");
    const coin = document.querySelector(".coin-flip");

    const urlRole = new URLSearchParams(location.search).get("role");
    const role = (urlRole === "manager" || urlRole === "worker")
      ? urlRole
      : (Math.random() < 0.5 ? "manager" : "worker");

    window.__assignedRole = role;

if (coin) {
  // Animate it
  coin.style.animation = "flip 3s steps(37) forwards";

  coin.addEventListener("animationend", () => {
    // Create a frozen replacement
    const frozenCoin = document.createElement("div");
    frozenCoin.className = "coin-frozen";

    // Replace the animated coin with the frozen one
    coin.replaceWith(frozenCoin);


    if (txt) txt.textContent = "You are a " + role + ".";
  });
}

    function proceed() {
      if (splash) splash.classList.add("hidden");
      document.dispatchEvent(new CustomEvent("splash:proceed", { detail: { role } }));
    }

    if (btn) {
      btn.addEventListener("click", proceed, { once: true });
    }

    if (splash) {
      splash.addEventListener("click", function (e) {
        if (e.target === splash) proceed();
      });
    }
  }
})();
