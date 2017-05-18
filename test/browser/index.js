const world = new World;

// some fancy hack
world.state = UI.data;

// starting state
world.add_state('storage.wood', 0);
world.add_state('lumberjack.wood', 0);
// world.add_state('lumberjack.has_axe', false);
// world.add_state('storage.has_axe', false);

// spawn npcs
const blacksmith = new BlackSmith(world, [
  new ForgeAxe,
  new StoreAxe,
], 'blacksmith');

blacksmith.planner.add_goal('storage.has_axe', true);

const lumberjack = new Lumberjack(world, [
  new ChopLogs,
  new StoreWood,
  new GetAxe,
], 'lumberjack');

lumberjack.planner.add_goal('storage.wood', v => v >= 10);






setInterval(function () {
  lumberjack.update();
  blacksmith.update();
}, UI.fps(3));
