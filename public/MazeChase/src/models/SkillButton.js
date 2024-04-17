class SkillButton extends Button {
  constructor(imageRoute, x, y) {
    super(imageRoute, x, y);

    this.cooldownImage = new Image();
    this.cooldownImage.src = images.cooldown;
    this.cooldownHeight = this.height;
    //this.timer = new CenteredText("", "#f59e0b", x, y);
  }

  paint() {
    super.paint();
    if (this.cooldownVisible) {
      context.drawImage(
        this.cooldownImage,
        this.x - this.width / 2,
        this.y - this.height / 2 + (this.height - this.cooldownHeight),
        this.width,
        this.cooldownHeight
      );
      //this.timer.paint();
    }
  }

  startCooldown() {
    let secondsLeft = 10;
    this.cooldownVisible = true; // Mostrar cooldown
    //this.timer.value = secondsLeft;

    this.skillTimer = setInterval(() => {
      secondsLeft--;
      //this.timer.value = secondsLeft;
      this.cooldownHeight = (secondsLeft * this.height) / 10; // Reducir la altura del cooldown

      if (secondsLeft < 0) {
        clearInterval(this.skillTimer);
        this.cooldownVisible = false; // Ocultar cooldown al finalizar
        this.cooldownHeight = this.height;
        //this.timer.value = "";
      }
    }, 1000);
  }

  isReseted() {
    return !this.cooldownVisible;
  }

  switchSkill(imageRoute) {
    this.image.src = imageRoute;
  }
}
