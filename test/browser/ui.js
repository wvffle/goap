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
    }, this.tps(30));
  }

  random_pos(x = 0, y = 0, w = q('').clientWidth - 20, h = q('').clientHeight - 20) {
    return {
      x: this.random(x, x + w),
      y: this.random(y, y + h),
    }
  }

  random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }

  tps(target) {
    return 1000 / target;
  }
});
