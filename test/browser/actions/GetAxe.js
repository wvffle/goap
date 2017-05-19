class GetAxe extends BasicAction {
  constructor() {
    super(storage);

    this.add_precondition('storage.has_axe', true);
    this.add_effect('storage.has_axe', false);
    this.add_effect('lumberjack.has_axe', true);
  }
}