class MovementsPlaceholder extends Model {
  constructor(x, y) {
    super(images.placeholder3, x, y);

    this.placeholder3 = new Background(images.placeholder5, this.x, this.y);
    this.placeholder5 = new Background(images.placeholder5, this.x, this.y);
    this.placeholder7 = new Background(images.placeholder7, this.x, this.y);

    this.placeholder = this.placeholde3;
  }

  paint() {
    this.placeholder.paint();
  }

  setRound(round) {
    this.placeholder = this["placeholder"+round];
  }
}
