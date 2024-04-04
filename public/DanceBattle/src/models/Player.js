class Player extends Model {
  constructor(x, y, name, position) {
    super(images["player_" + position], x, y);

    this.position = position;
    this.movementsQueue = new MovementsQueue(position);

    this.idleAnim = new Animation(
      images["player_" + position + "_idle"],
      this.width,
      this.height,
      4,
      4
    );

    this.upAnim = new Animation(
      images["player_" + position + "_up"],
      this.width,
      this.height,
      4,
      4
    );

    this.rightAnim = new Animation(
      images["player_" + position + "_right"],
      this.width,
      this.height,
      4,
      4
    );

    this.downAnim = new Animation(
      images["player_" + position + "_down"],
      this.width,
      this.height,
      4,
      4
    );

    this.leftAnim = new Animation(
      images["player_" + position + "_left"],
      this.width,
      this.height,
      4,
      4
    );

    this.spaceAnim = new Animation(
      images["player_" + position + "_space"],
      this.width,
      this.height,
      4,
      4
    );

    this.animation = this.idleAnim;
    this.tag = new CenteredText(name, "#FFFFFF", x, y - this.height / 2 - 20);
  }

  update() {
    this.animation.update();
  }

  paint() {
    this.tag.paint();
    this.movementsQueue.paint();
    this.animation.paint(this.x, this.y);
  }

  playDance(movements, rightMovements, callback) {
    let index = 0;
    const playNextMovement = () => {
      if (index < movements.length) {
        const movement = movements[index];
        const rightMovement = rightMovements[index];
        if (this.position != "back") {
          // Las del jugador actual ya están pintadas
          this.movementsQueue.addMovement(movement, rightMovement);
        } else {
          this.movementsQueue.verifyMovement(index, rightMovement);
        }
        this.setAnimation(movement, () => {
          index++;
          playNextMovement();
        });
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
    this[movement + "Anim"].callback = callback;
    this.animation = this[movement + "Anim"];
  }
}
