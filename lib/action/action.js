const Events = require('events');

class Action extends Events {

  /**
   * Constructs an action
   */
  constructor(agent) {
    super();

    this.agent = agent;
    this.agent.actions.push(this);

    this.preconditions = {};
    this.effects = {};
    this.cost = 1;
  }

  /**
   * Adds a prediction to the action
   */
  add_precondition(precondition, value) {
    if (typeof value === 'function') {
      return this.preconditions[precondition] = { func: value }
    }

    this.preconditions[precondition] = { value };
  }

  /**
   * Removes prediction from the action
   */
  remove_precondition(precondition) {
    delete this.preconditions[precondition];
  }

  /**
   * Adds an effect to the action
   */
  add_effect(effect, value) {
    if (typeof value === 'function') {
      return this.effects[effect] = { func: value }
    }
    this.effects[effect] = { value };
  }

  /**
   * Removes effect from the actiion
   */
  remove_effect(effect) {
    delete this.effects[effect];
  }

  /**
   * Checks wether action can be performed or not
   */
  is_in_range() {
    return false;
  }

  /**
   * Performs the action
   */
  perform(world, agent) {
    agent.emit('perform', this);
    this.emit('perform');
    if(this.cancel === true) {
      this.cancel = false;
      return false;
    }

    for (let e in this.effects) {
      const effect = this.effects[e];
      if (effect.func !== undefined) {
        world.state[e] = effect.func(world.state[e], world.state);
        continue;
      }

      world.state[e] = effect.value;
    }

    return true;
  }

}

module.exports = Action;
