const World      = require('../lib/world');
const Lumberjack = require('./lumberjack');

const Action = {
  get_axe: require('./actions/get_axe'),
  collect: require('./actions/collect'),
  chop_logs: require('./actions/chop_logs'),
}

// World
const world = new World;

// States
world.add_state('has wood', false);
world.add_state('has axe', false);
world.add_state('axe exists', true);

// Actions

const actions = [
  new Action.get_axe,
  new Action.collect,
  new Action.chop_logs,
];

const npc = new Lumberjack(world, actions);
module.exports = npc;
