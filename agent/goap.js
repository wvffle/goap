const Agent = require('./agent');

class GOAPAgent extends Agent {
  /**
   * Constructs a goap agent
   */
  constructor(world, action_planner) {
    super(world);

    this.plan = [];
    this.planner = action_planner;

    fsm.push(this.idle);
  }

  /**
   * Default goap idle state
   */
  idle() {
    const plan = this.planner.plan(this.world);
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
      console.warn('move_to: empty plan supplied');
      this.fsm.pop();
      return this.fsm.push(this.idle);
    }

    // Get current action
    const action = this.plan[0];

    // move the agent
    this.fsm.pop();
  }

  /**
   * Default goap perform_action state
   */
  perform_action() {

    // Idle if we don't have the plan
    if (this.plan.length === 0) {
      console.warn('perform_action: empty plan supplied');
      this.fsm.pop();
      this.fsm.push(this.idle);
      return;
    }

    // Get current action
    // And remove it from plan queue
    const action = this.plan[0];

    if (action.perform()) {
      this.plan.unshift();
    } else {
      this.fsm.pop();
      this.fsm.push(this.idle);
    }
  }

  /**
   * Dummy move_agent function
   */
  move_agent() {
    console.warn('move_agent is not implemented in', this.constructor.name);
  }
}
