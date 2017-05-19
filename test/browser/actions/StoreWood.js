class StoreWood extends BasicAction {
  constructor() {
    super(storage);

    this.add_precondition('lumberjack.wood', v => v >= 10);

    this.add_effect('lumberjack.wood', v => v - 10);
    this.add_effect('storage.wood', v => v + 10);
  }
}
