class CountInput extends Model {
  constructor(image, x, y, seats) {
    super(image, x, y);

    this.increasing = false;
    this.decreasing = false;
    this.increaseBg = new Background(images.counter_up, x, y);
    this.decreaseBg = new Background(images.counter_down, x, y);

    this.delay = 50;
    this.input = new CenteredText(0, "#000000", x, y + 20, 40);
  }

  update() {
    if (this.increasing || this.decreasing) {
      this.delay--;
    }
    if (this.delay <= 0) {
      this.stop();
      this.delay = 50;
    }
  }

  paint() {
    if (this.increasing) {
      this.increaseBg.paint();
    } else if (this.decreasing) {
      this.decreaseBg.paint();
    } else {
      super.paint();
    }
    this.input.paint();
  }

  increase() {
    if (!this.increasing && this.input.value < 99) {
      this.decreasing = false;
      this.increasing = true;
      this.input.value++;
    }
  }

  decrease() {
    if (!this.increasing && this.input.value > 0) {
      this.decreasing = false;
      this.decreasing = true;
      this.input.value--;
    }
  }

  stop() {
    this.increasing = false;
    this.decreasing = false;
  }

  emitValue() {
    socket.emit("action", {
      count: this.input.value,
    });
  }
}
