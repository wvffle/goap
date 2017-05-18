class Lumberjack extends NPC {
  constructor(world, actions, name, x, y) {
    super(world, actions, name, x, y);

    this.fsm.on('state transition', (f, t) => console.log('fsm ', f.name, '->', t.name))
    this.planner.on('plan found', p => console.log('plan', p.map(a => a.constructor.name)))
  }
}
