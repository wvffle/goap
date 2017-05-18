const GOAPAgent = require('../lib/agent/goap');

class Lumberjack extends GOAPAgent {
  constructor(world, actions) {
    super(world, actions);

    /*
    this.planner.add_goal('has wood', function (value) {
      return value >= world.data.min_wood;
    });
    */
    this.planner.add_goal('wood passed', 1)

    this.planner.on('plan found', plan => {
      console.log('[planner]', plan.map(a => a.constructor.name));
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
