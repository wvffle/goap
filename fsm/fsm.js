const FSMState = require('./state');

class FSM {
  /**
   * Constructs a fsm
   */
  constructor() {

  }

  /**
   * Sets state as an active state
   */
  set_state(state) {
    if (state instanceof FSMState) {
      return this.active_state = state;
    }

    throw new Error('state is not a FSMState');
  }

  /**
   * Executes the state
   */
  execute() {
    if (this.active_state !== undefined) {
      this.active_state.execute();
    }
  }
}

module.exports = FSM;
