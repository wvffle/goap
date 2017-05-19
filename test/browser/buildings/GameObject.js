class GameObject {
  constructor(clazz, x, y) {
    q().append(this.element = e(`.object.${clazz}`));
    this.element.css({
      left: x,
      top:  y,
    })
  }

  get pos() {
    return {
      x: this.element.getBoundingClientRect().x,
      y: this.element.getBoundingClientRect().y,
    };
  }

  get dim() {
    return {
      w: this.element.getBoundingClientRect().width,
      h: this.element.getBoundingClientRect().height,
    };
  }

  get random_pos() {
    const npc_size = 20;
    const { x, y } = this.pos;
    const { w, h } = this.dim;
    return UI.random_pos(x, y, w - npc_size, h - npc_size);
  }

  in_range(point) {
    const { x, y } = this.pos;
    const { w, h } = this.dim;
    return point.x >= x && point.x <= x + w && point.y >= y && point.y <= y + h;
  }
};
