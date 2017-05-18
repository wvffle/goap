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
world.add_state('has wood', 0);
world.add_state('has axe', false);
world.add_state('axe exists', true);

world.data = {
  min_wood: 4,
};

// Actions

const actions = [
  new Action.get_axe,
  new Action.collect(world),
  new Action.chop_logs(world),
  new Action.chop_logs(world),
];

const npc = new Lumberjack(world, actions);
module.exports = npc;
