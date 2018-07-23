const Node = require('./node')
const Action = require('./action')

const PriorityQueue = require('fastpriorityqueue')

const clone = require('lodash.clonedeep')
const eq = require('lodash.isequal')

class Agent {
  constructor (world, name = ++Agent.ID) {
    this.world = world
    this.name = name

    this.goals = new Map()
    this.actions = new PriorityQueue((a, b) => a.cost > b.cost)
    this._plan = []

    if (new.target === Agent) {
      console.warn(`shouldn't call new Agent() directly`)
    }

    if (this.move === Agent.prototype.move) {
      console.warn(`${new.target.name}.prototype.move is not defined`)
    }

    if (this.isInRange === Agent.prototype.isInRange) {
      console.warn(`${new.target.name}.prototype.isInRange is not defined`)
    }

    if (this.getActionCost === Agent.prototype.getActionCost) {
      console.warn(`${new.target.name}.prototype.getActionCost is not defined`)
    }

    const self = this

    this.states = {
      idle () {
        // fsm: idle
        if (self._plan.length === 0) {
          self._plan = self.plan()
        }

        if (self._plan.length === 0) {
          return
        }

        self.fsm.push(self.states.action)
      },
      move () {
        // fsm: idle, action, move

        const action = self._plan[self._plan.length - 1]

        self.move(action)
        self.fsm.pop() // (-) move
      },
      action () {
        // fsm: idle, action
        const action = self._plan[self._plan.length - 1]

        if (!action) {
          self.fsm.pop() // (-) action
          return
        }

        if (!self.isInRange(action)) {
          self.fsm.push(self.states.move)
          return
        }

        console.log(`[${self.name}] current action: ${action.name}(${action.cost})`)

        self.doAction(action)
        self._plan.pop()
        self.fsm.pop() // (-) action
      },
    }

    this.fsm = [ this.states.idle ]
  }

  action (action) {
    if (!(action instanceof Action)) throw new Error('argument 1 is not an Action')

    this.actions.add(action)
  }

  goal (name, goal) {
    // support named functions
    if (typeof name === 'function' && typeof goal === 'undefined') {
      goal = name
      name = goal.name
    }

    if (typeof goal !== 'function') throw new Error('argument 2 is not a Function')

    this.goals.set(name, goal)
  }

  removeGoal (name) {
    this.goals.delete(name)
  }

  plan () {
    const opened = new PriorityQueue((a, b) => a.cost < b.cost);
    const closed = [];
    const plan = []


    const start = new Node(this.world, 0, null, null)
    start.calcHeuristic(this)

    opened.add(start)

    while (!opened.isEmpty()) {
      // process current stack
      let node = opened.poll()
      closed.push(node)

      if (node.matchesGoal(this)) {
        while (node.parent) {
          plan.push(node.action)
          node = node.parent
        }

        return plan
      }

      const actions = this.actions.clone()
      while (!actions.isEmpty()) {
        const action = actions.poll()

        // check preconditions
        if (!action.validate(node.state, this.name)) continue

        // populate state
        const nextState = action.apply(clone(node.state), this.name)

        // skip if already closed
        if (closed.some(n => eq(n.state, nextState))) {
          continue
        }

        let ref = opened.array.find(n => eq(n.state, nextState))
        const cost = this.getActionCost(action)
        if (!ref) {
          ref = new Node(nextState, node.cost + cost, node, action)
          ref.calcHeuristic(this)
          opened.add(ref)
          continue
        }

        if (node.cost + cost < ref.cost) {
          ref.parent = node
          ref.cost = node.cost + cost
          ref.calcHeuristic(this)
          ref.action = action
        }
      }
    }
  }

  move () {
    this._inRange = true
  }

  isInRange (action) {
    if (this._inRange === true) {
      this._inRange = false
      return true
    }

    return false
  }

  getActionCost (action) {
    return action.cost
  }

  doAction (action) {
    action.apply(this.world, this.name)
  }

  update () {
    const state = this.fsm[this.fsm.length - 1]
    console.log(`[${this.name}] current state: ${state.name}`)
    state()
  }
}

module.exports = Agent
module.exports.ID = 0
