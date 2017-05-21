class ForgeAxe extends BasicAction {
  constructor(agent) {
    super(agent, forge);

    this.add_precondition('blacksmith.rocks', v => v >= 7);
    this.add_precondition('blacksmith.wood', v => v >= 3);

    this.add_effect('blacksmith.rocks', v => v - 7);
    this.add_effect('blacksmith.wood', v => v - 3);

    this.add_effect('blacksmith.has_axe', true);
  }
}
