const Events = require('events');

class Action extends Events {

  /**
   * Constructs an action
   */
  constructor() {
    super();

    this.preconditions = {};
    this.effects = [];

    this.cost = 0;
  }

  /**
   * Adds a prediction to the action
   */
  add_precondition(precondition, value) {
    this.preconditions[precondition] = value;
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
    this.effects[effect] = value;
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
  perform(world) {
    for (let effect of this.effects) {
      effect.apply();
    }

    this.emit('perform');
  }

}

module.exports = Action;
