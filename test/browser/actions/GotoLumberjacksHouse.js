class GotoLumberjacksHouse extends BasicAction {
  constructor() {
    super(lumberjackshouse);

    this.add_effect('lumberjack.in_house', true);
  }
}
