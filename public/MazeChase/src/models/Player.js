class Player extends Model {
  constructor(x, y) {
    super(images.player, x, y);

    this.xv = 0; // velocidadX
    this.yv = 0; // velocidadY

    this.nextXMovement = 0;
    this.nextYMovement = 0;
    this.stuned = false;
  }

  update() {
    if (this.nextXMovement == this.xv && this.xv != 0) {
      this.nextXMovement = 0;
      this.yv = 0;
    } else if (this.nextXMovement != 0) {
      this.xv = this.nextXMovement * 3;
    }

    if (this.nextYMovement == this.yv && this.yv != 0) {
      this.nextYMovement = 0;
      this.xv = 0;
    } else if (this.nextYMovement != 0) {
      this.yv = this.nextYMovement * 3;
    }
  }

  addXMovement(direction) {
    this.nextXMovement = direction;
    this.nextYMovement = 0;
  }

  addYMovement(direction) {
    this.nextYMovement = direction;
    this.nextXMovement = 0;
  }

  addDirection(direction) {
    switch (direction) {
      case "X":
        this.nextXMovement = 1;
        this.nextYMovement = 0;
        break;
      case "-X":
        this.nextXMovement = -1;
        this.nextYMovement = 0;
        break;
      case "Y":
        this.nextYMovement = 1;
        this.nextXMovement = 0;
        break;
      case "-Y":
        this.nextYMovement = -1;
        this.nextXMovement = 0;
        break;
    }
  }

  stop() {
    this.xv = 0;
    this.yv = 0; 

    this.nextXMovement = 0;
    this.nextYMovement = 0;
  }

  useSkill(name) {
    console.log("POWER " + name);
  }

  stun() {
    this.stop();
    this.stuned = true;
  }

  collides(model) {
    if (!this.stuned) {
      return super.collides(model);
    }
    return false;
  }
}
