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
    return {
      x: GameObject.random(x, x+w-npc_size),
      y: GameObject.random(y, y+h-npc_size),
    };
  }

  static random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
};
