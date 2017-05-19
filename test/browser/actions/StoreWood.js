class StoreWood extends BasicAction {
  constructor() {
    super(storage);

    this.add_precondition('lumberjack.wood', v => v > 0);

    this.add_effect('storage.wood', (v, s) => v + s['lumberjack.wood']);
    this.add_effect('lumberjack.wood', v => 0);
  }
}
