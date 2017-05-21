class GotoForge extends BasicAction {
  constructor(agent) {
    super(agent, forge);

    this.add_effect('blacksmith.in_forge', true);
  }
}
