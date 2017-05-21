class ChopLogs extends BasicAction {
  constructor(agent) {
    super(agent, forest);

    this.cost = 4;

    this.add_precondition('lumberjack.has_axe', true);
    this.add_effect('lumberjack.in_house', false);
    this.add_effect('lumberjack.wood', v => v + 10);
  }
}
