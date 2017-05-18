const World      = require('../lib/world');
const Lumberjack = require('./lumberjack');

const Action = {
  get_axe: require('./actions/get_axe'),
  collect: require('./actions/collect'),
  chop_logs: require('./actions/chop_logs'),
  pass_wood: require('./actions/pass_wood'),
}

// World
const world = new World;

// States
world.add_state('has wood', 0);
world.add_state('wood passed', 0);
world.add_state('has axe', false);
world.add_state('axe exists', true);

world.data = {
  min_wood: 2,
};

// Actions

const actions = [
  //new Action.get_axe,
  //new Action.collect(world),
  new Action.chop_logs(world),
  new Action.chop_logs(world),
  new Action.chop_logs(world),
  new Action.chop_logs(world),
  new Action.pass_wood(world),
];

const npc = new Lumberjack(world, actions);
module.exports = npc;
