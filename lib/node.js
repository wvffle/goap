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

  calcHeuristic (agent) {
    this.h = 0
    const { world, goals, name } = agent
    for (const [_name, fn] of goals) {
      if (!fn(world, this.state, name)) {
        this.h += 1
      }
    }
  }

  matchesGoal (agent) {
    for (const [name, fn] of agent.goals) {
      if (!this.parent || !fn(this.parent.state, this.state, agent.name)) {
        return false
      }
    }

    return true
  }
}

module.exports = Node
