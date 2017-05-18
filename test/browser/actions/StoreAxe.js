class StoreAxe extends BasicAction {
  constructor() {
    super();

    this.add_precondition('blacksmith.has_axe', true);

    this.add_effect('blacksmith.has_axe', false);
    this.add_effect('storage.has_axe', true);
  }

  get pos() {
    return storage.random_pos;
  }
}
