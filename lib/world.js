class World {
  /**
   * Constructs a new world
   */
  constructor() {
    this.state = {};
  }

  /**
   * Adds a state to the world
   */
  add_state(name, state) {
    this.state[name] = state;
  }

  /**
   * Removes the state from the world
   */
  remove_state(name, state) {
    delete this.state[name];
  }

};

module.exports = World;
