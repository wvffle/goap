class StoreWood extends BasicAction {
  constructor() {
    super();

    this.add_precondition('lumberjack.wood', v => v >= 10);

    this.add_effect('lumberjack.wood', v => v - 10);
    this.add_effect('storage.wood', v => v + 10);
  }

  get pos() {
    return storage.random_pos;
  }
}
