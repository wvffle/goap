const World    = require('./world');
const State    = require('./state');
const Action   = require('./action');
const Planner  = require('./planner');

const FSM      = require('./fsm/fsm');
const FSMState = require('./fsm/state');

// FSM
class MoveToState extends FSMState {
  execute() {

  }
};

class PerformActionState extends FSMState {
  execute() {

  }
};

class IdleState extends FSMState {
  execute() {

  }
};

const fsm = new FSM;
const MoveTo        = new MoveToState;
const PerformAction = new PerformActionState;
const Idle          = new IdleState;
fsm.set_state(Idle);

// World
const world = new World;

// States
world.add_state(new State('has wood', false));
world.add_state(new State('has axe', true));

// Actions
const getAxe          = new Action(2);
getAxe.add_precondition('has axe', false);
getAxe.add_effect('has axe', true);
const chopLog         = new Action(4);
chopLog.add_precondition('has axe', true);
chopLog.add_effect('has wood', true);
const collectBranches = new Action(8);
collectBranches.add_effect('has wood', true);

const ap = new Planner;
console.log(ap.plan(world));
