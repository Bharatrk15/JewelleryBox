// Handles click -> move out & scale up, and back on close.
AFRAME.registerComponent("ring-selectable", {
  schema: {
    openOffset: { type: "vec3", default: { x: 0, y: 0.1, z: 0.9 } },
    openScale: { type: "vec3", default: { x: 1.5, y: 1.5, z: 1.5 } },
  },

  init: function () {
    const el = this.el;
    const scene = el.sceneEl;
    this.system = scene.systems["ring-state"];

    this.originalPosition = Object.assign({}, el.getAttribute("position"));
    const originalScale = el.getAttribute("scale") || { x: 1, y: 1, z: 1 };
    this.originalScale = Object.assign({}, originalScale);

    this.onClick = this.onClick.bind(this);
    this.onOpenComplete = this.onOpenComplete.bind(this);
    this.onCloseComplete = this.onCloseComplete.bind(this);

    el.addEventListener("click", this.onClick);
  },

  onClick: function () {
    if (!this.system.canOpen(this.el)) return;
    this.system.startOpening(this.el);
    this.animateOpen();
  },

  animateOpen: function () {
    const el = this.el;
    const offset = this.data.openOffset;

    const targetPos = {
      x: this.originalPosition.x + offset.x,
      y: this.originalPosition.y + offset.y,
      z: this.originalPosition.z + offset.z,
    };

    el.removeAttribute("animation__moveopen");
    el.removeAttribute("animation__scaleopen");
    el.removeAttribute("animation__moveclose");
    el.removeAttribute("animation__scaleclose");

    el.setAttribute("animation__moveopen", {
      property: "position",
      to: `${targetPos.x} ${targetPos.y} ${targetPos.z}`,
      dur: 600,
      easing: "easeOutQuad",
    });

    const s = this.data.openScale;
    el.setAttribute("animation__scaleopen", {
      property: "scale",
      to: `${s.x} ${s.y} ${s.z}`,
      dur: 600,
      easing: "easeOutQuad",
    });

    el.addEventListener("animationcomplete__moveopen", this.onOpenComplete, {
      once: true,
    });
  },

  animateClose: function () {
    const el = this.el;

    el.removeAttribute("animation__moveopen");
    el.removeAttribute("animation__scaleopen");
    el.removeAttribute("animation__moveclose");
    el.removeAttribute("animation__scaleclose");

    const p = this.originalPosition;
    el.setAttribute("animation__moveclose", {
      property: "position",
      to: `${p.x} ${p.y} ${p.z}`,
      dur: 600,
      easing: "easeInOutQuad",
    });

    const s = this.originalScale;
    el.setAttribute("animation__scaleclose", {
      property: "scale",
      to: `${s.x} ${s.y} ${s.z}`,
      dur: 600,
      easing: "easeInOutQuad",
    });

    el.addEventListener("animationcomplete__moveclose", this.onCloseComplete, {
      once: true,
    });
  },

  onOpenComplete: function () {
    this.system.finishOpening();
  },

  onCloseComplete: function () {
    this.system.finishClosing();
  },
});
