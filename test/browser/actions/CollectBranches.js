class CollectBranches extends BasicAction {
  constructor() {
    super(forest);

    this.cost = 9;

    this.add_effect('lumberjack.wood', v => v + 3);
  }
}
