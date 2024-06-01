class Player extends Model {
  constructor(x, y, player) {
    super(images.player, x, y);

    this.xv = 0; // velocidadX
    this.yv = 0; // velocidadY
    this.speed = 4;

    this.nextXMovement = 0;
    this.nextYMovement = 0;
    this.invulnerable = false;

    this.headUpAnim = new Animation(images["head_u_" + player], 32, 32, 4, 2);
    this.headRightAnim = new Animation(images["head_r_" + player], 32, 32, 4, 2);
    this.headDownAnim = new Animation(images["head_d_" + player], 32, 32, 4, 2);
    this.headLeftAnim = new Animation(images["head_l_" + player], 32, 32, 4, 2);

    this.tailUpAnim = new Animation(images["tail_u_" + player], 32, 32, 4, 4);
    this.tailRightAnim = new Animation(images["tail_r_" + player], 32, 32, 4, 4);
    this.tailDownAnim = new Animation(images["tail_d_" + player], 32, 32, 4, 4);
    this.tailLeftAnim = new Animation(images["tail_l_" + player], 32, 32, 4, 4);

    this.freezeAnim = new Animation(images.ice_particles, 40, 40, 16, 2);
    this.dashAnim = new Animation(images.dash_particles, 32, 32, 4, 4, this.endDashAnim.bind(this));
    this.dashing = false;
    this.dashX = 0;
    this.dashY = 0;

    this.headAnimation = this.headDownAnim;
    this.tailAmimation = this.tailDownAnim;
    this.pursued = false;
    this.tailXOffset = 0;
    this.tailYOffset = 0;

    this.tag = new CenteredText("", "#563F2E", x, y);
  }

  paint() {
    if (this.dashing) {
      this.dashAnim.paint(this.dashX, this.dashY);
    }

    if (this.pursued) {
      this.tailAmimation.paint(
        this.x + this.tailXOffset,
        this.y + this.tailYOffset
      );
    }

    if (this.frozen) {
      this.freezeAnim.paint(this.x, this.y)
    }

    if (this.invulnerable) {
      context.globalAlpha = 0.4;
      this.headAnimation.paint(this.x, this.y);
      context.globalAlpha = 1;
    } else {
      this.headAnimation.paint(this.x, this.y);
    }

    this.tag.paint();
  }

  update() {
    if (this.nextXMovement == this.xv && this.xv != 0) {
      this.nextXMovement = 0;
      this.yv = 0;
    } else if (this.nextXMovement != 0) {
      this.xv = this.nextXMovement * this.speed;
    }

    if (this.nextYMovement == this.yv && this.yv != 0) {
      this.nextYMovement = 0;
      this.xv = 0;
    } else if (this.nextYMovement != 0) {
      this.yv = this.nextYMovement * this.speed;
    }

    this.tag.x = this.x;
    this.tag.y = this.y - this.height / 2 - 20;
    this.updateAnimations();
  }

  updateAnimations() {
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

    if (this.yv != 0 || this.xv != 0) {
      if (this.pursued) {
        this.tailAmimation.update();
      }

      this.headAnimation.update();
    }
    this.freezeAnim.update();

    if (this.dashing) {
      this.dashAnim.update();
    }

  }

  startMoving() {
    if (this.pursued) {
      this.addDirection("-X");
    }
    else {
      this.addDirection("X");
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

  switchRole() {
    this.pursued = !this.pursued;
    if (this.pursued) {
      this.speed = 3;
    } else {
      this.speed = 4;
    }
  }

  useSkill(opponent) {
    if (this.pursued) {
      console.log("self dash");
      this.speedUp();
    } else {
      console.log("freeze oponent");
      opponent.stop();
      opponent.frozen = true;

      setTimeout(() => {
        opponent.frozen = false;
      }, 3000);
    }
  }

  haunt() {
    playEffect(soundEffects.haunted);
    this.stop();
    disableKeyboardInput();
    this.invulnerable = true;

    setTimeout(() => {
      this.invulnerable = false;
      if (!this.frozen) {
        enableKeyboardInput();
      }
    }, 3000);
  }

  makeInvulnerable() {
    this.stop();
    this.invulnerable = true;

    setTimeout(() => {
      this.invulnerable = false;
    }, 3000);
  }

  freeze() {
    playEffect(soundEffects.freeze);
    this.stop();
    disableKeyboardInput();
    this.frozen = true;

    setTimeout(() => {
      this.frozen = false;
      if (!this.invulnerable) {
        enableKeyboardInput();
      }
    }, 2000);
  }

  speedUp() {
    playEffect(soundEffects.dash);
    this.dashX = this.x;
    this.dashY = this.y;
    this.dashing = true;
    this.speed = 25;
    setTimeout(() => {
      this.speed = 3;
    }, 100);
  }

  endDashAnim() {
    this.dashing = false;
  }

  stop() {
    this.xv = 0;
    this.yv = 0;

    this.nextXMovement = 0;
    this.nextYMovement = 0;
  }

  collides(model) {
    if (!this.invulnerable) {
      return super.collides(model);
    }
    return false;
  }
}
