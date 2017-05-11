const World = require('../world');
const log   = require('util').inspect;

class PlanNode {
  /**
   * Constructs a plan node
   */
  constructor(state, cost = 0, action = null, parent = null) {
    this.action = action;
    this.parent = parent;
    this.cost   = cost;
    this.state  = state;
  }
}

class ActionPlanner {
  /**
   * Construct an action planner
   */
  constructor() {
    this.goals = {};
  }

  /**
   * Create plan
   * @param   {World}       world      World instance
   * @param   {Action[]}    actions    Available actions
   *
   * @returns {Action[]}               Action plan
   */
  plan(world, avail_actions) {
    if (world instanceof World) {
      const actions = [];

      const leaves = [];
      const start  = new PlanNode(world.state);

      if (ActionPlanner.graph(start, leaves, avail_actions, this.goals, world) !== false) {
        let curr = null;
        for (let leaf of leaves) {
          if (curr === null) curr = leaf;
          else if (curr.cost > leaf.cost) {
            curr = leaf;
          }
        }

        while (curr !== null && curr.action != null) {
          actions.push(curr.action.cost);
          curr = curr.parent;
        }
      }

      return actions.reverse();
    }

    throw new Error('world is not a World');
  }

  static graph(parent, leaves, avail_actions, goals, world) {
    let found = false;

    for (let action of avail_actions) {
      if (ActionPlanner.in_state(action.preconditions, parent.state)) {
        const curr_state = ActionPlanner.populate_state(parent.state, action.effects);
        const node = new PlanNode(curr_state, parent.cost + action.cost, action, parent);
        if (ActionPlanner.in_state(goals, curr_state, true)) {
          leaves.push(node);
          found = true;
        } else {
          const subset = avail_actions.filter(a => a !== action);
          found = found || ActionPlanner.graph(node, leaves, subset, goals, world);
        }
      }
    }

    return found;
  }

  static in_state(source, state, strict = false) {
    for (let s in source) {
      if (strict === false && state[s] === undefined) continue;
      if (source[s] !== state[s]) {
        return false;
      }
    }

    return true;
  }

  static populate_state(state, changes) {
    const res = {};
    for (let s in state) {
      res[s] = state[s];
    }

    for (let c in changes) {
      res[c] = changes[c];
    }

    return res;
  }

  /**
   * Adds goal to the action planner
   * @param   {String}      goal       State name
   * @param   {Object}      value      State value
   */
  add_goal(goal, value) {
    this.goals[goal] = value;
  }
}

module.exports = ActionPlanner;
