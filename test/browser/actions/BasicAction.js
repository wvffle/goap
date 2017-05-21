class BasicAction extends Action {

  constructor(agent, object) {
    super(agent);

    this.cost = 1;

    this.object = object;
    // have to set this.agent by hand in NPC class
  }

  get pos() {
    return this.object.random_pos;
  }

  is_in_range() {
    return this.object.in_range(this.agent.pos);
  }
}
