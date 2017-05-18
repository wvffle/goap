const Action = require('../../lib/action/action');

class Collect extends Action {
  constructor(world) {
    super();

    this.cost = 19;
    this.in_range = false;

    this.add_precondition('has wood', function (value) {
      return value <= world.data.min_wood;
    });

    this.add_effect('has wood', function (value) {
      return value + 5;
    });
  }

  is_in_range() {
    return this.in_range;
  }
}

module.exports = Collect;

