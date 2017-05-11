const Action = require('../../action/action');

class Collect extends Action {
  constructor() {
    super();

    this.cost = 8;
    this.in_range = false;

    this.add_effect('has wood', true);
  }

  is_in_range() {
    return this.in_range;
  }
}

module.exports = Collect;

