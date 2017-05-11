const Action = require('../../action/action');

class ChopLogs extends Action {
  constructor() {
    super();

    this.cost = 4;
    this.in_range = false;

    this.add_precondition('has axe', true);

    this.add_effect('has wood', true);
  }

  is_in_range() {
    return this.in_range;
  }
}

module.exports = ChopLogs;
