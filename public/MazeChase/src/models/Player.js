class Player extends Model {
  constructor(x, y) {
    super(images.player, x, y);

    this.xv = 0; // velocidadX
    this.yv = 0; // velocidadY

    this.nextXMovement = 0;
    this.nextYMovement = 0;
    this.stuned = false;

    this.tail = new Image();
    this.tail.src = images.tail;

    this.head = new Image();
    this.head.src = images.player_visual;
  }

  paint() {
    super.paint();
    
    context.drawImage(
      this.tail,
      this.x - this.width / 2,
      this.y - this.height / 2 -32
    );

    context.drawImage(
      this.head,
      this.x - this.head.width / 2,
      this.y - this.head.height / 2
    );
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
