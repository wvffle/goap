class StoreRocks extends BasicAction {
  constructor() {
    super(storage);

    this.add_precondition('miner.rocks', v => v > 0);

    this.add_effect('storage.rocks', (v, s) => v + s['miner.rocks']);
    this.add_effect('miner.rocks', v => 0);
  }
}
