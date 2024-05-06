class CountInput extends Model {
  constructor(image, x, y, seats) {
    super(image, x, y);

    this.input = new CenteredText(0, "#000000", x, y);
  }

  paint() {
    super.paint();
    this.input.paint();
  }

  increase() {
    if (this.input.value < 99) {
      this.input.value++;
    }
  }

  decrease() {
    if (this.input.value > 0) {
      this.input.value--;
    }
  }

  emitValue() {
    socket.emit("action", {
      count: this.input.value,
    });
  }
}
