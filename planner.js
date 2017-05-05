const World = require('./world');

class ActionPlanner {
  /**
   * Construct an action planner
   */
  constructor() {

  }

  /**
   * Create plan
   *
   * @returns Action[]
   */
  plan(world) {
    if (world instanceof World) {
      const actions = [];
      return actions;
    }

    throw new Error('world is not a World');
  }

  perform(actions, world) {
    for (action in actions) {
      action.perform(world);
    }
  }
}

module.exports = ActionPlanner;
