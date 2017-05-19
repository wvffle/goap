const world = new World;

// some fancy hack
world.state = UI.data;

// starting state
world.add_state('storage.wood', 0);
world.add_state('lumberjack.wood', 0);

// spawn npcs
const blacksmith = new BlackSmith(world, [
  ForgeAxe,
  StoreAxe,
  GotoForge,
], 'blacksmith');

blacksmith.planner.add_goal('storage.has_axe', true);
blacksmith.planner.add_goal('blacksmith.in_forge', true);

const lumberjack = new Lumberjack(world, [
  ChopLogs,
  CollectBranches,
  StoreWood,
  GetAxe,
], 'lumberjack');

lumberjack.planner.add_goal('storage.wood', v => v > world.state['storage.wood'] && v < 100);






setInterval(function () {
  lumberjack.update();
  blacksmith.update();
}, UI.tps(3));
