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

    this.position = position;
    this.movementsPlaceholder = new MovementsPlaceholder(this.x, this.y);
    this.movements = [];
    this.movementsIcons = [];
    this.wrongIcons = [];
  }

  paint() {
    this.movementsPlaceholder.paint();

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
    let movementIcon = new Background(images[movement], xpos, this.y);
    this.movements.push(movement);
    this.movementsIcons.push(movementIcon);

    if (rightMovement != null && movement != rightMovement) {
      playEffect(soundEffects.wrong);
      let wrongIcon = new Background(images.wrong, xpos, this.y);
      this.wrongIcons.push(wrongIcon);
    } else if (this.position == "back") {
      playEffect(soundEffects.key);
    } else {
      playEffect(soundEffects.correct);
    }
  }

  verifyMovement(moveIndex, rightMovement) {
    if (
      rightMovement != null &&
      this.movements.length > 0 &&
      this.movements[moveIndex] != rightMovement
    ) {
      playEffect(soundEffects.wrong);
      let moveIcon = this.movementsIcons[moveIndex];
      let wrongIcon = new Background(images.wrong, moveIcon.x, moveIcon.y);
      this.wrongIcons.push(wrongIcon);
    } else {
      playEffect(soundEffects.correct);
    }
  }

  clear() {
    this.movements = [];
    this.movementsIcons = [];
    this.wrongIcons = [];
  }
}
