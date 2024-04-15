class Player extends Model {
  constructor(x, y) {
    super(images.player, x, y);

    this.xv = 0; // velocidadX
    this.yv = 0; // velocidadY

    this.nextXMovement = 0;
    this.nextYMovement = 0;
    this.stuned = false;

    this.headUpAnim = new Animation(images["head_u"], 32, 32, 4, 1);

    this.headRightAnim = new Animation(images["head_r"], 32, 32, 4, 1);

    this.headDownAnim = new Animation(images["head_d"], 32, 32, 4, 1);

    this.headLeftAnim = new Animation(images["head_l"], 32, 32, 4, 1);

    this.tailUpAnim = new Animation(images["tail_u"], 32, 32, 4, 1);

    this.tailRightAnim = new Animation(images["tail_r"], 32, 32, 4, 1);

    this.tailDownAnim = new Animation(images["tail_d"], 32, 32, 4, 1);

    this.tailLeftAnim = new Animation(images["tail_l"], 32, 32, 4, 1);

    this.headAnimation = this.headDownAnim;
    this.tailAmimation = this.tailDownAnim;
    this.pursued = false;
    this.tailXOffset = 0;
    this.tailYOffset = 0;
  }

  paint() {
    super.paint();

    if (this.pursued) {
      this.tailAmimation.paint(this.x + this.tailXOffset, this.y + this.tailYOffset);
    }

    this.headAnimation.paint(this.x, this.y);
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

    if (this.xv > 0 && this.yv == 0) {
      this.headAnimation = this.headRightAnim;
      this.tailAmimation = this.tailRightAnim;
      this.tailXOffset = -this.width;
      this.tailYOffset = 0;
    }
    if (this.xv < 0 && this.yv == 0) {
      this.headAnimation = this.headLeftAnim;
      this.tailAmimation = this.tailLeftAnim;
      this.tailXOffset = this.width;
      this.tailYOffset = 0;
    }

    if (this.yv > 0 && this.xv == 0) {
      this.headAnimation = this.headDownAnim;
      this.tailAmimation = this.tailDownAnim;
      this.tailXOffset = 0;
      this.tailYOffset = -this.height;
    }
    if (this.yv < 0 && this.xv == 0) {
      this.headAnimation = this.headUpAnim;
      this.tailAmimation = this.tailUpAnim;
      this.tailXOffset = 0;
      this.tailYOffset = this.height;
    }

    if (this.pursued) {
      this.tailAmimation.update();
    }

    this.headAnimation.update();
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
