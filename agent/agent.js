const FSM = require('./fsm/fsm');
const Events = require('events');

class Agent extends Events {
  /**
   * Constructs an agent
   */
  constructor(world) {
    super();

    this.world = world;
    this.fsm = new FSM;
  }
}
