class ForgeAxe extends BasicAction {
  constructor() {
    super();

    this.add_effect('blacksmith.has_axe', true);
  }

  get pos() {
    return forge.random_pos;
  }
}
