class Model {
  constructor(imageRoute, x, y) {
    this.image = cache[imageRoute];
    if (!this.image) {
      console.error(`Image not found in cache: ${imageRoute}`);
      return;
    }
    this.x = x;
    this.y = y;
    this.width = this.image.width;
    this.height = this.image.height;
  }

  paint() {
    if (this.image.complete) {
      // La imagen ya está cargada completamente
      context.drawImage(
        this.image,
        this.x - this.width / 2,
        this.y - this.height / 2
      );
    }
  }

  collides(model) {
    let collides = false;

    if (
      model.x - model.width / 2 <= this.x + this.width / 2 &&
      model.x + model.width / 2 >= this.x - this.width / 2 &&
      this.y + this.height / 2 >= model.y - model.height / 2 &&
      this.y - this.height / 2 <= model.y + model.height / 2
    ) {
      collides = true;
    }
    return collides;
  }

  collidesCircle(model) {
    // Calcular la distancia entre los centros de los círculos
    const distance = Math.sqrt(
      (this.x - model.x) ** 2 + (this.y - model.y) ** 2
    );

    // Verificar si la distancia es menor que la suma de los radios
    return distance < this.width / 2 + model.width / 2;
  }
}

module.exports = { Model };