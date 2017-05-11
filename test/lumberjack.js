const GOAPAgent = require('../lib/agent/goap');

class Lumberjack extends GOAPAgent {
  constructor(world, actions) {
    super(world, actions);

    this.planner.add_goal('has wood', true);

    this.planner.on('plan found', plan => {
      console.log('[planner]', plan);
    });

    this.fsm.on('state transition', (from, to) => {
      console.log('[fsm]', from.name, '->', to.name);
    })
  }

  move_agent(action) {
    console.log('moved to action');
    action.in_range = true;
  }
};

module.exports = Lumberjack;
