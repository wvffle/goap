class CollectBranches extends BasicAction {
  constructor(agent) {
    super(agent, forest);

    this.cost = 9;

    this.add_effect('lumberjack.in_house', false);
    this.add_effect('lumberjack.wood', v => v + 3);
  }
}
