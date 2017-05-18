module.exports = {
  FSM:           require('./lib/fsm'),
  World:         require('./lib/world'),
  Agent:         require('./lib/agent/agent'),
  GOAPAgent:     require('./lib/agent/goap'),
  Action:        require('./lib/action/action'),
  ActionPlanner: require('./lib/action/planner'),
  version:       require('./package.json').version,
}
