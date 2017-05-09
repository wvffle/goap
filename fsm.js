const FSMState = require('./state');

class FSM {
  /**
   * Constructs a fsm
   */
  constructor() {
    this.stack = [];
  }

  /**
   * Pushes state to the state stack
   */
  push(state) {
    return this.stack.push(state);
  }

  /**
   * Pops state from the state stack
   *
   * @returns Action - Current action
   */
  pop(state) {
    return this.stack.pop();
  }

  /**
   * Updates the state
   */
  update() {
    this.stack[this.stack.length - 1]();
  }
}

module.exports = FSM;
