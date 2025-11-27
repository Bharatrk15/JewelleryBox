// Drag (mouse/touch) to rotate around Y-axis only, when ring is active.
AFRAME.registerComponent("drag-rotate-y", {
  schema: {
    speed: { default: 0.4 },
  },

  init: function () {
    this.dragging = false;
    this.startX = 0;
    const rot = this.el.getAttribute("rotation") || { x: 0, y: 0, z: 0 };
    this.currentY = rot.y;

    this.system = this.el.sceneEl.systems["ring-state"];

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);

    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);

    this.el.addEventListener("mousedown", this.onMouseDown);
    window.addEventListener("mousemove", this.onMouseMove);
    window.addEventListener("mouseup", this.onMouseUp);

    this.el.addEventListener("touchstart", this.onTouchStart);
    window.addEventListener("touchmove", this.onTouchMove);
    window.addEventListener("touchend", this.onTouchEnd);
  },

  canRotate: function () {
    return (
      this.system &&
      this.system.activeRing === this.el &&
      !this.system.isAnimating
    );
  },

  onMouseDown: function (e) {
    if (!this.canRotate()) return;
    this.dragging = true;
    this.startX = e.clientX;
    e.stopPropagation();
  },

  onMouseMove: function (e) {
    if (!this.dragging) return;
    const dx = e.clientX - this.startX;
    this.startX = e.clientX;
    this.currentY += dx * this.data.speed;

    const rot = this.el.getAttribute("rotation") || { x: 0, y: 0, z: 0 };
    this.el.setAttribute("rotation", {
      x: rot.x,
      y: this.currentY,
      z: rot.z,
    });
  },

  onMouseUp: function () {
    this.dragging = false;
  },

  onTouchStart: function (e) {
    if (!this.canRotate()) return;
    if (e.touches.length !== 1) return;
    this.dragging = true;
    this.startX = e.touches[0].clientX;
    e.stopPropagation();
  },

  onTouchMove: function (e) {
    if (!this.dragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - this.startX;
    this.startX = e.touches[0].clientX;
    this.currentY += dx * this.data.speed;

    const rot = this.el.getAttribute("rotation") || { x: 0, y: 0, z: 0 };
    this.el.setAttribute("rotation", {
      x: rot.x,
      y: this.currentY,
      z: rot.z,
    });
  },

  onTouchEnd: function () {
    this.dragging = false;
  },

  remove: function () {
    this.el.removeEventListener("mousedown", this.onMouseDown);
    window.removeEventListener("mousemove", this.onMouseMove);
    window.removeEventListener("mouseup", this.onMouseUp);

    this.el.removeEventListener("touchstart", this.onTouchStart);
    window.removeEventListener("touchmove", this.onTouchMove);
    window.removeEventListener("touchend", this.onTouchEnd);
  },
});
