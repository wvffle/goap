const UI = new (class UI {
  constructor() {
    q().append(this.element = e('.ui'));
    this.data = {};

    this.interval = setInterval(() => {
      this.element.clear();
      for (let d in this.data) {
        const el = e('.data');
        el.append(e('.key'));
        el.append(e('.val'));
        el.children[0].innerHTML = d;
        el.children[1].innerHTML = JSON.stringify(this.data[d]);
        this.element.append(el);
      }
    }, this.fps(30));
  }

  fps(target) {
    return 1000 / target;
  }
});
