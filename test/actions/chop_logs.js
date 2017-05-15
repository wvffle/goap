const Action = require('../../lib/action/action');

class ChopLogs extends Action {
  constructor(world) {
    super();

    this.cost = 5;
    this.in_range = false;

    this.add_precondition('has axe', true);
    this.add_precondition('has wood',  function (value) {
      return value <= world.data.min_wood;
    });

    /**
     * desired: 6
     * combinations   result   cost   1/(r+c)*1000
     * 3 + 3          6        10     62.50
     * 5 + 5          10       16     38.46
     * 5 + 3          8        13     47.61
     *
     *
     * desired: 8
     * combinations   result   cost   1/(r+c)*1000
     * 3 + 3 + 3      9        15     41.66
     * 5 + 5          10       16     38.46
     * 5 + 3          8        13     41.61
     *
     *
     * desired: 12
     * combinations   result   cost   1/(r+c)*1000
     * 3 + 3 + 3 + 3  12       20     31.25
     * 5 + 5 + 5      15       24     25.64
     * 5 + 5 + 3      13       23     27.77
     * 5 + 3 + 3 + 3  14       23     27.02
     *
     */
    this.add_effect('has wood', function (value) {
      return value + 3;
    });
  }

  is_in_range() {
    return this.in_range;
  }
}

module.exports = ChopLogs;
