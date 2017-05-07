const World    = require('../world');
const State    = require('../state');
const Action   = require('../action/action');
const Planner  = require('../action/planner');

// World
const world = new World;

// States
world.add_state('has wood', false);
world.add_state('has axe', false);
world.add_state('axe exists', false);

// Actions
const getAxe          = new Action(2);
getAxe.add_precondition('axe exists', true);
getAxe.add_precondition('has axe', false);
getAxe.add_effect('has axe', true);

const chopLog         = new Action(4);
chopLog.add_precondition('has axe', true);
chopLog.add_effect('has wood', true);

const collectBranches = new Action(8);
collectBranches.add_effect('has wood', true);

const actions = [
  getAxe,
  chopLog,
  collectBranches,
]

const ap = new Planner;
ap.add_goal('has wood', true);

ap.plan(world, actions);
