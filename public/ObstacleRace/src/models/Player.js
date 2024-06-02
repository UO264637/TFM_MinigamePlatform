class Player extends Model {
  constructor(x, y) {
    super(images.player, x, y);
    this.state = PlayerStatuses.IDLE;

    this.xv = 0; // velocidadX
    this.yv = 0; // velocidadY

    // Animaciones
    this.idleAnim = new Animation(
      images.idle_player,
      this.width,
      this.height,
      6,
      4
    );

    this.runningAnim = new Animation(
      images.running_player,
      this.width,
      this.height,
      3,
      4
    );

    this.crouchingAnim = new Animation(
      images.crouching_player,
      this.width,
      this.height,
      3,
      4
    );

    this.jumpingAnim = new Animation(
      images.jumping_player,
      this.width,
      this.height,
      3,
      4
    );

    this.hitAnim = new Animation(
      images.hit_player,
      this.width,
      this.height,
      3,
      8,
      this.endHitAnim.bind(this)
    );

    this.animation = this.idleAnim;
  }

  update() {
    this.animation.update();

    if (this.hitsBottom) {
      this.inTheAir = false;
    } else {
      this.inTheAir = true;
    }

    if (this.inTheAir && this.state == PlayerStatuses.MOVING) {
      this.state = PlayerStatuses.JUMPING;
    } else if (!this.inTheAir && this.state == PlayerStatuses.JUMPING) {
      this.state = PlayerStatuses.MOVING;
    }

    switch (this.state) {
      case PlayerStatuses.IDLE:
        this.animation = this.idleAnim;
        break;
      case PlayerStatuses.MOVING:
        this.animation = this.runningAnim;
        break;
      case PlayerStatuses.CROUCHED:
        this.animation = this.crouchingAnim;
        break;
      case PlayerStatuses.HIT:
        this.animation = this.hitAnim;
        break;
      case PlayerStatuses.JUMPING:
        this.animation = this.jumpingAnim;
        break;
    }
  }

  paint() {
    this.animation.paint(this.x, this.y);
  }

  run() {
    this.state = PlayerStatuses.MOVING;
  }

  stop() {
    this.state = PlayerStatuses.IDLE;
  }

  jump() {
    if (!this.inTheAir) {
      playEffect(soundEffects.jump);
      this.yv = -30;
      this.inTheAir = true;
    }
  }

  crouch() {
    if (!this.inTheAir && this.state != PlayerStatuses.CROUCHED) {
      playEffect(soundEffects.crouch);
      this.state = PlayerStatuses.CROUCHED;
      this.xv -= 3;
    }
  }

  standUp() {
    if (this.state == PlayerStatuses.CROUCHED) {
      this.state = PlayerStatuses.MOVING;
      this.xv += 3;
    }
  }

  hit() {
    if (this.state != PlayerStatuses.HIT) {
      playEffect(soundEffects.hit);
      this.state = PlayerStatuses.HIT;
    }
  }

  collidesCircle(model) {
    if (this.state != PlayerStatuses.CROUCHED) {
      return super.collidesCircle(model);
    } else {
      let collides = false;

      if (
        model.x - model.width / 2 <= this.x + this.width / 2 &&
        model.x + model.width / 2 >= this.x - this.width / 2 &&
        this.y + (this.height - 90) / 2 >= model.y - model.height / 2 &&
        this.y - (this.height - 90) / 2 <= model.y + model.height / 2
      ) {
        collides = true;
      }
      return collides;
    }
  }

  endHitAnim() {
    this.state = PlayerStatuses.MOVING;
  }
}
