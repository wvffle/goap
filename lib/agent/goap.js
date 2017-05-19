const Agent = require('./agent');
const ActionPlanner = require('../action/planner');

class GOAPAgent extends Agent {
  /**
   * Constructs a goap agent
   * @param {World}      world     world instance
   * @param {Action[]}   actions   available actions
   */
  constructor(world, actions) {
    super(world);

    this.plan = [];
    this.planner = new ActionPlanner;
    this.actions = actions;

    this.fsm.push(this.idle);
  }

  /**
   * Default goap idle state
   */
  idle() {
    const plan = this.planner.plan(this.world, this.actions);
    if (plan.length > 0) {
      this.plan = plan;

      this.fsm.pop();
      this.fsm.push(this.perform_action);
    } else {
      this.fsm.pop();
      this.fsm.push(this.idle);
    }
  }

  /**
   * Default goap move_to state
   */
  move_to() {

    // If the plan is empty
    // Agent has to remain idle
    if (this.plan.length === 0) {

      this.fsm.pop(); // move
      this.fsm.pop(); // perform_action
      this.emit('done');

      return this.fsm.push(this.idle);
    }

    // Get current action
    const action = this.plan[0];

    // move the agent
    if(action.is_in_range()) {
      return this.fsm.pop();
    }
    this.move_agent(action)
  }

  /**
   * Default goap perform_action state
   */
  perform_action() {

    // Idle if we don't have the plan
    if (this.plan.length === 0) {
      this.fsm.pop();
      this.emit('done');
      this.fsm.push(this.idle);
      return;
    }

    // Get current action
    // And remove it from plan queue
    const action = this.plan[0];
    this.emit('action', action);

    if (action) {
      const in_range = action.is_in_range();

      if (in_range) {
        if (action.perform(this.world, this)) this.plan.shift();
      } else {
        this.fsm.push(this.move_to);
      }
    } else {
      this.fsm.pop(); // perform_action
      this.emit('done');
      this.fsm.push(this.idle);
    }

  }

  /**
   * Update the state machine
   */
  update() {
    this.fsm.update(this);
  }

  /**
   * Dummy move_agent function
   * @param   {Action}   action   action instance
   *
   * @returns {boolean}           reached the targed?
   */
  move_agent(action) {
    console.warn('move_agent is not implemented in', this.constructor.name);
  }
};

module.exports = GOAPAgent;
