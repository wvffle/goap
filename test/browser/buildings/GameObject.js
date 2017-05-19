class GameObject {
  constructor(clazz, x, y) {
    q().append(this.element = e(`.object.${clazz}`));
    this.element.append(e('.info'));

    this.info = `object: ${clazz}`;

    if (x === undefined) x = UI.random_pos(undefined, undefined, undefined, undefined, 130 + 300).x;
    if (y === undefined) y = UI.random_pos(undefined, undefined, undefined, undefined, 60).y;

    console.log(clazz, x, y)

    this.element.css({
      left: x,
      top:  y,
    })
  }

  set info(val) {
    this.element.children[0].innerHTML = val;
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
