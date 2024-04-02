class Player extends Model {
  constructor(x, y, name, position) {
    super(images["player_" + position], x, y);

    this.position = position;
    this.movementsQueue = new MovementsQueue(position);

    this.animation = new Animation(
      images["player_" + position + "_idle"],
      this.width,
      this.height,
      4,
      4
    );

    this.tag = new CenteredText(name, "#FFFFFF", x, y - this.height / 2 - 15);
  }

  update() {
    this.animation.update();
  }

  paint() {
    this.movementsQueue.paint();
    this.animation.paint(this.x, this.y);
    this.tag.paint();
  }

  playDance(movements, callback) {
    let index = 0;

    const playNextMovement = () => {
      //console.log(this.animation);
      if (index < movements.length) {
        const movement = movements[index];
        if (this.position != "back") {
            this.movementsQueue.addMovement(movement);
        }
        this.setAnimation(movement,
            () => {
              index++;
              playNextMovement();
            }
        );
      } else {
        this.setAnimation("idle");
        if (callback) {
          setTimeout(() => {
            callback();
          }, 1000);
        }
      }
    };

    playNextMovement();
  }

  setAnimation(movement, callback) {
    this.animation = new Animation(
        images["player_" + this.position + "_" + movement],
        this.width,
        this.height,
        4,
        4,
        callback
      );
  }
}
