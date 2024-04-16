class AnimatedObstacle extends Model {
  constructor(image, animation, x, y) {
    super(image, x, y);

    this.yv = 0;
    this.xv = 0;

    this.animation = new Animation(animation, this.width, this.height, 6, 4);
  }

  update() {
    this.x += this.xv;
    this.animation.update();
  }

  paint() {
    this.animation.paint(this.x, this.y);
  }
}
