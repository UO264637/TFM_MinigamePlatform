class MovementsQueue {
  constructor(position) {
    switch (position) {
      case "front":
        this.x = originalCanvasWidth * 0.57;
        this.y = originalCanvasHeight * 0.6;
        break;
      case "back":
        this.x = originalCanvasWidth * 0.07;
        this.y = originalCanvasHeight * 0.94;
        break;
    }

    this.up = new Background(images.up, this.x, this.y);
    this.right = new Background(images.right, this.x, this.y);
    this.down = new Background(images.down, this.x, this.y);
    this.left = new Background(images.left, this.x, this.y);
    this.space = new Background(images.space, this.x, this.y);
    this.wrong = new Background(images.wrong, this.x, this.y);

    this.movements = [];
    this.movementsIcons = [];
    this.wrongIcons = [];
  }

  paint() {
    for (let movementIcon of this.movementsIcons) {
      movementIcon.paint();
    }

    for (let wrongIcon of this.wrongIcons) {
      wrongIcon.paint();
    }
  }

  addMovement(movement, rightMovement) {
    let xpos = this.x;
    if (this.movements.length > 0) {
      let previousMovement =
        this.movementsIcons[this.movementsIcons.length - 1];
      xpos = previousMovement.x + previousMovement.width + 8;
    }
    // Se clona el objeto para evitar cargarlo de nuevo
    let movementIcon = { ...this[movement], paint: this[movement].paint, x:xpos, y: this.y };

    this.movements.push(movement);
    this.movementsIcons.push(movementIcon);

    if (rightMovement != null && movement != rightMovement) {
      let wrongIcon = { ...this.wrong, paint: this[movement].paint, x:xpos, y: this.y };;
      this.wrongIcons.push(wrongIcon);
    }
  }

  verifyMovement(moveIndex, rightMovement) {
    if (
      rightMovement != null &&
      this.movements.length > 0 &&
      this.movements[moveIndex] != rightMovement
    ) {
      let moveIcon = this.movementsIcons[moveIndex];
      let wrongIcon = new Background(images.wrong, moveIcon.x, moveIcon.y);
      this.wrongIcons.push(wrongIcon);
    }
  }

  clear() {
    this.movements = [];
    this.movementsIcons = [];
    this.wrongIcons = [];
  }
}
