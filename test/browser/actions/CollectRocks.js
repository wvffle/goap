class CollectRocks extends BasicAction {
  constructor() {
    super(mine);

    this.cost = 9;

    this.add_effect('miner.rocks', v => v + 5);
  }
}
