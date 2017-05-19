class StoreAxe extends BasicAction {
  constructor() {
    super(storage);

    this.add_precondition('blacksmith.has_axe', true);

    this.add_effect('blacksmith.has_axe', false);
    this.add_effect('storage.has_axe', true);
  }
}
