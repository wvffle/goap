class Action {
  constructor (options = {}) {
    this.preconditions = []
    this.effects = []

    this.name = options.name || ++Action.ID
    this.data = options.data || {}
    this.cost = options.cost || 1
  }

  precondition (fn) {
    if (typeof fn !== 'function') throw new Error('argument 1 is not a function')

    this.preconditions.push(fn)
    return this
  }

  effect (fn) {
    if (typeof fn !== 'function') throw new Error('argument 1 is not a function')

    this.effects.push(fn)
    return this
  }

  validate (state, name) {
    for (const fn of this.preconditions) {
      if (!fn(state, name)) return false
    }

    return true
  }

  apply (state, name) {
    for (const fn of this.effects) {
      fn(state, name)
    }

    return state
  }
}

module.exports = Action
module.exports.ID = 0
