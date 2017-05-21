class GotoLumberjacksHouse extends BasicAction {
  constructor(agent) {
    super(agent, lumberjackshouse);

    this.add_effect('lumberjack.in_house', true);
  }
}
