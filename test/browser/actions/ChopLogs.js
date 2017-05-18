class ChopLogs extends BasicAction {
  constructor() {
    super();

    this.add_precondition('lumberjack.has_axe', true);
    this.add_effect('lumberjack.wood', v => v + 10);
  }

  get pos() {
    return forest.random_pos;
  }
}
