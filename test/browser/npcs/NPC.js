class NPC extends GOAPAgent {
  constructor(world, actions, name, x = 0, y = 0) {
    super(world, actions);

    q().append(this.element = e(`.npc.${name}`));
    this.element.css({
      left: x,
      top:  y,
    })

    this.in_move = false;
    this.name = name;
  }

  get pos() {
    return {
      x: this.element.getBoundingClientRect().x,
      y: this.element.getBoundingClientRect().y,
    };
  }

  move_agent(action) {
    if (this.in_move === false) {
      this.in_move = true;

      const time = this.animate_move(action.pos.x, action.pos.y);
      setTimeout(() => {
        this.in_move = false;
        action.in_range = true;
      }, time + 100);
    }
  }

  animate_move(x, y) {
    const T = (Math.abs(this.pos.x - x) + Math.abs(this.pos.y - y)) / 432 * 1000 ^ 0;
    console.log(T)
    this.element.css({
      transition: `top ${T}ms ease, left ${T}ms ease`,
      top:        (this.pos.y = y),
      left:       (this.pos.x = x),
    });

    return T;
  }
}
