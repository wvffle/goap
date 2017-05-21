class GetRocks extends BasicAction {
  constructor(agent) {
    super(agent, storage);

    this.add_precondition('storage.rocks', v => v >= 7);

    this.add_effect('storage.rocks', v => v - 7);
    this.add_effect('blacksmith.rocks', v => v + 7);
  }
}
