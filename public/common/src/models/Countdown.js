class Countdown {
  constructor(color = "#FFFFFF") {
    this.value = 4;
    this.color = color;
    this.size = 150;
    this.x = originalCanvasWidth * 0.5;
    this.y = originalCanvasHeight * 0.5;
    this.oppacity = 0;

    this.countdown = () => {
      if (this.value == 1) {
        this.value = "Go!";
        this.oppacity = 1;
        setTimeout(() => {
          this.countdown();
        }, 1000);
      } else if (this.value == "Go!") {
        this.value = null;
        enableKeyboardInput();
        enableTapInput();
      } else {
        playEffect(soundEffects.beep);
        this.value--;
        this.oppacity = 1;
        setTimeout(() => {
          this.countdown();
        }, 1000);
      }
    };
  }

  update() {
    this.oppacity -= 0.045;
  }

  paint() {
    if (this.value != null) {
      context.font = this.size + "px RetroGaming";
      context.fillStyle = "rgba(255, 255, 255, " + this.oppacity + ")";
      context.textAlign = "left";

      let textWidth = context.measureText(this.value).width;

      context.fillText(this.value, this.x - textWidth / 2, this.y);
    }
  }

  start() {
    this.countdown();
  }
}
