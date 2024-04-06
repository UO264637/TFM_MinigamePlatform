class MovementsPlaceholder extends Model {
  constructor(x, y) {
    super(images.placeholder3, x, y);

    this.placeholder3 = new Background(images.placeholder3, this.x, this.y);
    this.placeholder3.x = this.x + this.placeholder3.width/2-  25;
    this.placeholder5 = new Background(images.placeholder5, this.x, this.y);
    this.placeholder5.x = this.x + this.placeholder5.width/2-  25;
    this.placeholder7 = new Background(images.placeholder7, this.x, this.y);
    this.placeholder7.x = this.x + this.placeholder7.width/2-  25;

    this.placeholder = this.placeholder3;
  }

  paint() {
    this.placeholder.paint();
  }

  setRound(round) {
    this.placeholder = this["placeholder"+round];
  }
}
