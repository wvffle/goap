const Events = require('events');

class FSM extends Events {
  /**
   * Constructs a fsm
   */
  constructor() {
    super();

    this.stack = [];
    this.last_state = null;
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
  update(that) {
    const state = this.stack[this.stack.length - 1];
    state.call(that);

    this.emit('state transition', this.last_state || { name: null }, state);
    this.last_state = state;
  }
}

module.exports = FSM;
