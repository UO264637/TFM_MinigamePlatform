class CenteredText extends Text {
  constructor(value, color, x, y, size = 24) {
    super(value, color, x, y, size);
  }

  paint() {
    context.font = this.size + "px RetroGaming";
    context.fillStyle = this.color;
    context.textAlign = "left";

    let textWidth = context.measureText(this.value).width;
    this.width = context.measureText(this.value).width + this.size / 2;
    let centeredX = this.x - textWidth / 2;

    context.fillText(this.value, centeredX, this.y);
  }
}
