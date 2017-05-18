const Action = require('../../lib/action/action');

class PassWood extends Action {
  constructor() {
    super();

    this.in_range = false;

    this.add_precondition('has wood', 1);

    this.add_effect('has wood', 0);
    this.add_effect('wood passed', 1);
  }

  is_in_range() {
    return this.in_range;
  }
}

module.exports = PassWood;
