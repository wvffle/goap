const State = reqire('./state');

class World {
  /**
   * Constructs a new world
   */
  constructor() {
    this.states = {};
  }

  /**
   * Adds a state to the world
   */
  add_state(state) {
    if (state instanceof State) {
      return this.states[state.name] = state;
    }

    throw new Error('state is not a State');
  }

  /**
   * Removes the state from the world
   */
  remove_state(state) {
    if (state instanceof State) {
      return delete this.states[state.name];
    }

    if (state instanceof String) {
      return delete this.states[state];
    }

    throw new Error('state is not a State');
  }

  /**
   * Checks wether state is true or false
   */
  is(state_name) {
    if (typeof state_name !== 'string') {
      throw new Error('state_name is not a String');
    }

    if (this.states[state_name] !== undefined) {
      return this.states[state_name].value;
    }

    throw new Error(`state '${state_name}' does not exist in world`);
  }

};

module.exports = World;
