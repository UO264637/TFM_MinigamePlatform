class Animation {
  constructor(
    imageSrc,
    modelWidth,
    modelHeight,
    refreshRate,
    totalFrames,
    callback
  ) {
    this.callback = callback;

    this.image = new Image();
    this.image.src = imageSrc;

    this.modelWidth = modelWidth;
    this.modelHeight = modelHeight;
    this.refreshRate = refreshRate;
    this.totalFrames = totalFrames;

    this.actualFrame = 0;
    this.frameWidth = this.image.width / this.totalFrames;
    this.frameHeight = this.image.height;

    this.rectangleDrawing = {};
    this.rectangleDrawing.x = 0;
    this.rectangleDrawing.y = 0;
    this.rectangleDrawing.width = this.frameWidth;
    this.rectangleDrawing.height = this.frameHeight;

    this.lastUpdate = 0;
  }

  update() {
    this.lastUpdate++;

    if (this.lastUpdate > this.refreshRate) {
      this.lastUpdate = 0;
      // actualizar el frame
      this.actualFrame++;
      // Si llega al último frame evuelve al primero
      if (this.actualFrame >= this.totalFrames) {
        if (this.callback != null) {
          // avisar de que acabo
          this.actualFrame = 0;
          this.callback();
        } else {
          // reiniciar, es infinita
          this.actualFrame = 0;
        }
      }
    }
    // actualizar el rectangle (siguiente frame)
    this.rectangleDrawing.x = this.actualFrame * this.frameWidth;
  }

  paint(x, y) {
    context.drawImage(
      this.image,
      this.rectangleDrawing.x,
      this.rectangleDrawing.y,
      this.rectangleDrawing.width,
      this.rectangleDrawing.height,
      x - this.modelWidth / 2,
      y - this.modelHeight / 2,
      this.modelWidth,
      this.modelHeight
    );
  }
}
