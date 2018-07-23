class Node {
  constructor (state, cost, parent, action) {
    this.parent = parent
    this.action = action
    this.state = state
    this.cost = cost
    this.h = 0
  }

  get f () {
    return this.cost + this.h
  }

  calc_heuristic (agent) {
    this.h = 0
    const { world, goals, name } = agent
    for (const [_name, fn] of goals) {
      if (!fn(world, this.state, name)) {
        this.h += 1
      }
    }
  }
}

module.exports = Node
