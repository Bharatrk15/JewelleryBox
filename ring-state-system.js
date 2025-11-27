// System to manage box/ring state (ECS-style)
AFRAME.registerSystem("ring-state", {
  init: function () {
    this.activeRing = null;
    this.isAnimating = false;
    this.boxOpen = false;
  },

  setBoxOpen: function (isOpen) {
    this.boxOpen = isOpen;
  },

  canOpen: function (ringEl) {
    return (
      this.boxOpen &&
      !this.isAnimating &&
      (!this.activeRing || this.activeRing === ringEl)
    );
  },

  startOpening: function (ringEl) {
    this.isAnimating = true;
    this.activeRing = ringEl;
    const closeBtn = document.getElementById("closeButton");
    if (closeBtn) closeBtn.style.display = "inline-block";
  },

  finishOpening: function () {
    this.isAnimating = false;
  },

  startClosing: function () {
    this.isAnimating = true;
  },

  finishClosing: function () {
    this.isAnimating = false;
    this.activeRing = null;
    const closeBtn = document.getElementById("closeButton");
    if (closeBtn) closeBtn.style.display = "none";
  },

  closeActive: function () {
    if (!this.activeRing || this.isAnimating) return;
    this.startClosing();
    const comp = this.activeRing.components["ring-selectable"];
    if (comp) comp.animateClose();
    else this.finishClosing();
  },
});
