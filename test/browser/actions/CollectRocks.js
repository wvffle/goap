class CollectRocks extends BasicAction {
  constructor(agent) {
    super(agent, mine);

    this.cost = 9;

    this.add_effect('miner.rocks', v => v + 5);
  }
}
