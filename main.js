// Wire up the Close button to the ring-state system
document.addEventListener("DOMContentLoaded", function () {
  const closeBtn = document.getElementById("closeButton");
  const scene = document.querySelector("a-scene");
  if (!closeBtn || !scene) return;

  function attach() {
    closeBtn.addEventListener("click", function (evt) {
      // prevent the click from also hitting the 3D scene
      evt.stopPropagation();

      const system = scene.systems["ring-state"];
      if (system) {
        system.closeActive();
      }
    });
  }

  if (scene.hasLoaded) {
    attach();
  } else {
    scene.addEventListener("loaded", attach, { once: true });
  }
});
