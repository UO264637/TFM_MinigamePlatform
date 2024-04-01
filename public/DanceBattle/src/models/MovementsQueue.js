class MovementsQueue {
  constructor(position) {
    switch (position) {
      case "front":
        this.x = originalCanvasWidth * 0.6;
        this.y = originalCanvasHeight * 0.6;
        break;
      case "back":
        this.x = originalCanvasWidth * 0.09;
        this.y = originalCanvasHeight * 0.94;
        break;
    }
    this.movements = [];
    this.movementsIcons = []
  }

  paint() {
    for (let movementIcon of this.movementsIcons) {
        movementIcon.paint();
    }
  }

  addMovement(movement) {
    let xpos = this.x;
    if (this.movements.length > 0) {
      let previousMovement = this.movementsIcons[this.movementsIcons.length - 1];
      xpos = previousMovement.x + previousMovement.width;
    }

    let movementIcon = new Background(images[movement], xpos, this.y);
    this.movements.push(movement);
    this.movementsIcons.push(movementIcon);
  }

  clear() {
    this.movements = [];
    this.movementsIcons = []
  }
}
