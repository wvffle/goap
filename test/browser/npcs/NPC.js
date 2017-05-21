class NPC extends GOAPAgent {
  constructor(world, name, x, y) {
    super(world);

    if (x === undefined) x = UI.random_pos(undefined, undefined, undefined, undefined, 20).x;
    if (y === undefined) y = UI.random_pos(undefined, undefined, undefined, undefined, 20).y;

    q().append(this.element = e(`.npc.${name}`));
    this.element.append(e('.info'));

    this.element.css({
      left: x,
      top:  y,
    })

    this.in_move = false;
    this.name = name;

    this.data = {};
    const update = () => {
      this.info  = [
        `name:   ${name}`,
        `action: ${this.data.action || null}`,
        `fsm:    ${this.data.fsm || null}`,
      ].join('<br>');
    };

    update();
    this.fsm.on('state transition', (from, to) => {
      if (from.name !== to.name || this.data.fsm === undefined) {
        this.data.fsm = to.name;
        update();
      }
    });

    this.on('action', a => {
      if (this.data.action !== a.constructor.name) {
        this.data.action = a.constructor.name;
        update();
      }
    })
  }

  get pos() {
    return {
      x: this.element.getBoundingClientRect().x,
      y: this.element.getBoundingClientRect().y,
    };
  }

  set info(val) {
    return this.element.children[0].innerHTML = val;
  }

  move_agent(action) {
    if (this.in_move === false) {
      this.in_move = true;

      const time = this.animate_move(action.pos.x, action.pos.y);
      setTimeout(() => {
        this.in_move = false;
      }, time + 100);
    }
  }

  animate_move(x, y) {
    const T = (Math.abs(this.pos.x - x) + Math.abs(this.pos.y - y)) / 432 * 1000 ^ 0;
    this.element.css({
      transition: `top ${T}ms ease, left ${T}ms ease`,
      top:        (this.pos.y = y),
      left:       (this.pos.x = x),
    });

    return T;
  }
}
