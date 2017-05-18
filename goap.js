(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.goap = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {
  FSM:           require('./lib/fsm'),
  World:         require('./lib/world'),
  Agent:         require('./lib/agent/agent'),
  GOAPAgent:     require('./lib/agent/goap'),
  Action:        require('./lib/action/action'),
  ActionPlanner: require('./lib/action/planner'),
}

},{"./lib/action/action":2,"./lib/action/planner":3,"./lib/agent/agent":4,"./lib/agent/goap":5,"./lib/fsm":6,"./lib/world":7}],2:[function(require,module,exports){
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
    if (typeof value === 'function') {
      return this.preconditions[precondition] = { func: value }
    }

    this.preconditions[precondition] = { value };
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
    if (typeof value === 'function') {
      return this.effects[effect] = { func: value }
    }
    this.effects[effect] = { value };
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
    for (let e in this.effects) {
      const effect = this.effects[e];
      if (effect.func !== undefined) {
        world.state[e] = effect.func(world.state[e]);
        continue;
      }

      world.state[e] = effect.value;
    }

    this.emit('perform');

    return true;
  }

}

module.exports = Action;

},{"events":8}],3:[function(require,module,exports){
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

      if (ActionPlanner.in_state(this.goals, world.state)) {
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
      if (ActionPlanner.in_state(action.preconditions, parent.state)) {
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

},{"../world":7,"events":8}],4:[function(require,module,exports){
const FSM = require('../fsm');
const Events = require('events');

class Agent extends Events {
  /**
   * Constructs an agent
   */
  constructor(world) {
    super();

    this.world = world;
    this.fsm = new FSM;
  }
};

module.exports = Agent;

},{"../fsm":6,"events":8}],5:[function(require,module,exports){
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
    console.log(this)
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
      console.warn('move_to: empty plan supplied');

      this.fsm.pop(); // move
      this.fsm.pop(); // perform_action

      return this.fsm.push(this.idle);
    }

    // Get current action
    const action = this.plan[0];

    // move the agent
    this.move_agent(action)
    if(action.is_in_range()) {
      this.fsm.pop();
    }
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

    if (action) {
      const in_range = action.is_in_range();
      console.log('in_range', in_range)

      if (in_range) {
        if (action.perform(this.world)) this.plan.shift();
      } else {
        this.fsm.push(this.move_to);
      }
    } else {
      this.fsm.pop(); // perform_action
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

},{"../action/planner":3,"./agent":4}],6:[function(require,module,exports){
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

},{"events":8}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}]},{},[1])(1)
});