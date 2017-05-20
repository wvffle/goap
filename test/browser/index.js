const world = new World;

// some fancy hack
world.state = UI.data;

// starting state
world.add_state('storage.wood', 0);
world.add_state('lumberjack.wood', 0);

world.add_state('storage.rocks', 0);
world.add_state('miner.rocks', 0);

world.add_state('blacksmith.rocks', 0);
world.add_state('blacksmith.wood', 0);

// spawn npcs
const blacksmith = new BlackSmith(world, [
  ForgeAxe,
  StoreAxe,
  GotoForge,
  GetRocks,
  GetWood,
], 'blacksmith');

blacksmith.planner.add_goal('storage.has_axe', true);
blacksmith.planner.add_goal('blacksmith.in_forge', true);

const lumberjack = new Lumberjack(world, [
  ChopLogs,
  CollectBranches,
  StoreWood,
  GetAxe,
  GotoLumberjacksHouse,
], 'lumberjack');

lumberjack.planner.add_goal('storage.wood', v => v > world.state['storage.wood'] && v < 100);
lumberjack.planner.add_goal('lumberjack.in_house', true);

const miner = new Miner(world, [
  CollectRocks,
  StoreRocks,
], 'miner');

miner.planner.add_goal('storage.rocks', v => v > world.state['storage.rocks'] && v < 30);
// miner.planner.add_goal('storage.iron', v => v > world.state['storage.iron'] && v < 30);






setInterval(function () {
  lumberjack.update();
  blacksmith.update();
  miner.update();
}, UI.tps(3));
