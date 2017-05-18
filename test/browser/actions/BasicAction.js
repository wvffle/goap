class BasicAction extends Action {

  constructor() {
    super();

    this.in_range = false;
  }

  get pos() {
    return {
      x: 0,
      y: 0,
    };
  }

  is_in_range() {
    return this.in_range;
  }
}
