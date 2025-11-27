// Click the box (invisible clickable surface) to open/close lid.
AFRAME.registerComponent("jewelry-box-toggle", {
  schema: {
    // open lid to a perfect vertical 90 degrees
    openRotation: { type: "vec3", default: { x: -90, y: 0, z: 0 } },
    closedRotation: { type: "vec3", default: { x: 0, y: 0, z: 0 } },
    duration: { default: 700 },
  },

  init: function () {
    const scene = this.el.sceneEl;
    this.ringSystem = scene.systems["ring-state"];
    this.lid = this.el.querySelector("[data-lid]");
    this.isOpen = false;
    this.isAnimating = false;

    if (!this.lid) {
      console.warn("jewelry-box-toggle: no [data-lid] found");
      return;
    }

    this.onClick = this.onClick.bind(this);
    this.el.addEventListener("click", this.onClick);
  },

  onClick: function (evt) {
    if (!this.lid || this.isAnimating) return;

    // Don't toggle box while a ring is active
    if (this.ringSystem && this.ringSystem.activeRing) return;

    if (!this.isOpen) {
      this.openLid();
    } else {
      this.closeLid();
    }
  },

  openLid: function () {
    this.isAnimating = true;

    this.lid.removeAttribute("animation__closelid");
    this.lid.removeAttribute("animation__openlid");

    const rot = this.data.openRotation;
    this.lid.setAttribute("animation__openlid", {
      property: "rotation",
      to: `${rot.x} ${rot.y} ${rot.z}`,
      dur: this.data.duration,
      easing: "easeOutQuad",
    });

    this.lid.addEventListener("animationcomplete__openlid", () => {
      this.isAnimating = false;
      this.isOpen = true;
      if (this.ringSystem) this.ringSystem.setBoxOpen(true);
    }, { once: true });
  },

  closeLid: function () {
    this.isAnimating = true;

    this.lid.removeAttribute("animation__openlid");
    this.lid.removeAttribute("animation__closelid");

    const rot = this.data.closedRotation;
    this.lid.setAttribute("animation__closelid", {
      property: "rotation",
      to: `${rot.x} ${rot.y} ${rot.z}`,
      dur: this.data.duration,
      easing: "easeInOutQuad",
    });

    this.lid.addEventListener("animationcomplete__closelid", () => {
      this.isAnimating = false;
      this.isOpen = false;
      if (this.ringSystem) this.ringSystem.setBoxOpen(false);
    }, { once: true });
  },
});
