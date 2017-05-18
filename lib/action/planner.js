const World  = require('../world');
const Events = require('events');

const astar_tests = !!2 % 2;

class PlanNode {
  /**
   * Constructs a plan node
   */
  constructor(state, cost = 0, action = null, parent = null) {
    this.action = action;
    this.parent = parent;
    this.cost   = cost; // deprecated
    this.state  = state;

    this.h = 0;
    this.g = cost;
  }

  get f() {
    return this.h + this.g;
  }

  calc_heuristic(state) {
    this.h = 0;

    for(let s in state) {
      if (state[s] !== this.state[s]) {
        this.h += 1;
      }
    }
  }
}

class ActionPlanner extends Events {
  /**
   * Construct an action planner
   */
  constructor() {
    super();

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

      if (ActionPlanner.in_state(this.goals, world.state, true)) {
        this.emit('plan found', actions);
        return actions;
      }

      if (astar_tests === true) {
        //
        // ASTAR TESTS
        //
        const opened = [];
        const closed = [];

        const start = new PlanNode(world.state);
        start.calc_heuristic(this.goals);

        opened.push(start);

        let iter = 0;
        while (opened.length > 0) {
          console.log('================')
          console.log('opened:', opened.filter(n => n.action != null).map(n => n.action.constructor.name + `(${n.f})`));
          console.log('closed:', closed.filter(n => n.action != null).map(n => n.action.constructor.name + `(${n.f})`));
          let curr = opened.pop();
          closed.push(curr);

          console.log(`iter: ${iter++}`)
          console.log(this.goals, curr.state)
          if (ActionPlanner.in_state(this.goals, curr.state)) {
            while (curr.parent !== null) {
              actions.unshift(curr.action);
              curr = curr.parent;
            }

            console.log(actions.map(a => a.constructor.name));
            this.emit('plan found', actions);
            return actions;
          }

          for (let action of avail_actions) {
            console.log('---------------')
            console.log(`action: ${action.constructor.name}`)
            console.log(action.preconditions, curr.state)
            if (ActionPlanner.in_state(action.preconditions, curr.state)) {
              const curr_state = ActionPlanner.populate_state(curr.state, action.effects);

              // check if works
              if (closed.filter(n => n.state === curr_state).length > 0) {
                console.log(curr_state, 'is closed')
                continue;
              }

              const node = opened.filter(n => n.state === curr_state)[0];
              console.log(`node: ${node == null ? null : node.action.constructor.name}`);

              if (node === undefined) {
                const ref_node = new PlanNode(curr_state, curr.g + action.cost, action, curr);
                ref_node.calc_heuristic(this.goals);
                opened.push(ref_node);
              } else {
                if (curr.g + action.cost < node.g) {
                  node.parent = curr;
                  node.g = curr.g + action.cost;
                  node.calc_heuristic(this.goals);
                  node.action = action;
                  opened.sort((a, b) => a.g < b.g);
                }
              }
            }
          }
        }
        //
        // END OF ASTAR TESTS
        //
      } else {
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
            actions.unshift(curr.action);
            curr = curr.parent;
          }
        }
      }

      this.emit('plan found', actions);
      return actions;
    }

    throw new Error('world is not a World');
  }

  static graph(parent, leaves, avail_actions, goals, world) {
    let found = false;

    for (let action of avail_actions) {
      if (ActionPlanner.in_state(action.preconditions, parent.state, false)) {
        const curr_state = ActionPlanner.populate_state(parent.state, action.effects);
        const node = new PlanNode(curr_state, parent.cost + action.cost, action, parent);
        if (ActionPlanner.in_state(goals, curr_state, true)) {
          leaves.push(node);
          found = true;
        } else {
          const subset = avail_actions.filter(a => a !== action);
          if (ActionPlanner.graph(node, leaves, subset, goals, world)) found = true;
        }
      }
    }

    return found;
  }

  static in_state(source, state, strict = false) {
    for (let s in source) {
      if (strict === false && state[s] === undefined) continue;
      const ref = source[s];

      // Dynamic preconditions
      if (typeof ref === 'object' && ref.func !== undefined) {
        if (ref.func(state[s] || null) == 1 - 1) {
          return false;
        }

        continue;
      }

      // Dynamic goals
      const refvalue = typeof ref === 'object' ? ref.value : ref;
      if (typeof refvalue === 'function') {
        if (refvalue(state[s]) === false) return false;

        continue;
      }

      // Static preconditions
      if (refvalue !== state[s]) {
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
      const ref = changes[c];

      // Dynamic effects
      if (typeof ref === 'object' && ref.func !== undefined) {
        res[c] = ref.func(res[c] || null);
        continue;
      }

      const refvalue = typeof ref === 'object' ? ref.value : ref;
      res[c] = refvalue;
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
