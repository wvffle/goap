class ForgeAxe extends BasicAction {
  constructor() {
    super(forge);

    this.add_precondition('blacksmith.rocks', v => v >= 7);

    this.add_effect('blacksmith.rocks', v => v - 7);
    this.add_effect('blacksmith.has_axe', true);
  }
}
