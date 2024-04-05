class Background extends Model {
  constructor(imageRoute, x, y) {
    super(imageRoute, x, y);
    this.xv = 0;
  }

  update() {
    if (this.xv != 0) {
      if (this.auxBackground == null) {
        this.auxBackground = new Background(this.image.src, this.x, this.y);
      }

      this.x = this.x + this.xv;

      // margen derecho se sale por la izquierda
      if (this.x + this.width / 2 < 0) {
        // vuelve a aparecer por la parte derecha
        this.x = originalCanvasWidth + this.width / 2;
      }
      // margen izquierdo se sale por la derecha
      if (this.x - this.width / 2 > originalCanvasWidth) {
        // vuelve a la parte izquierda
        this.x = 0 - this.width / 2;
      }
    }
  }

  paint() {
    super.paint();

    if (this.auxBackground != null) {
      // hueco por la izquierda
      if (this.x - this.width / 2 > 0) {
        // pintar auxiliar por la izquierda
        this.auxBackground.x = this.x - this.width;
      }
      // hueco por la derecha
      if (this.x + this.width / 2 < originalCanvasWidth) {
        // pintar auxiliar por la derecha
        this.auxBackground.x = this.x + this.width;
      }
      this.auxBackground.paint();
    }
  }
}
