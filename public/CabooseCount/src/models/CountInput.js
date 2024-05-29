class CountInput extends Model {
  static DEFAULT_DELAY = 5;

  constructor(image, x, y, seats) {
    super(image, x, y);

    this.increasing = false;
    this.decreasing = false;
    this.increaseBg = new Background(images.counter_up, x, y);
    this.decreaseBg = new Background(images.counter_down, x, y);

    this.delay = CountInput.DEFAULT_DELAY;
    this.input = new CenteredText(0, "#563F2E", x, y + 20, 40);
  }

  update() {
    if (this.increasing || this.decreasing) {
      this.delay--;
    }
    if (this.delay <= 0) {
      this.stop();
      this.delay = CountInput.DEFAULT_DELAY;
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
      playEffect(soundEffects.key);
      this.decreasing = false;
      this.increasing = true;
      this.input.value++;
    }
  }

  decrease() {
    if (!this.decreasing && this.input.value > 0) {
      playEffect(soundEffects.key);
      this.increasing = false;
      this.decreasing = true;
      this.input.value--;
    }
  }

  stop() {
    this.increasing = false;
    this.decreasing = false;
    this.delay = CountInput.DEFAULT_DELAY;
  }

  emitValue() {
    socket.emit("action", {
      count: this.input.value,
    });
  }
}
