class ChopLogs extends BasicAction {
  constructor() {
    super(forest);

    this.add_precondition('lumberjack.has_axe', true);
    this.add_effect('lumberjack.wood', v => v + 10);
  }
}
