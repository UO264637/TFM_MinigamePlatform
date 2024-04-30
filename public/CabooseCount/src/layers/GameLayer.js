class GameLayer extends Layer {
  constructor() {
    super();
    this.results = new ResultsLayer();
    this.initialize();
  }

  initialize() {
    this.countdown = new Countdown();
    this.backgrounds = [];
    this.cars = [];
    this.floorY = originalCanvasHeight - 200;
    this.speed = 0;

    for (let i = 0; i < 5; i++) {
      this["background" + i] = new Background(
        images["background" + i],
        originalCanvasWidth * 0.5,
        originalCanvasHeight * 0.5
      );
      this.backgrounds.push(this["background" + i]);
    }

    this.floor_background = new Background(
      images.floor_background,
      originalCanvasWidth * 0.5,
      originalCanvasHeight * 0.5
    );
    this.backgrounds.push(this.floor_background);

    this.background5 = new Background(
      images.background5,
      originalCanvasWidth * 0.5,
      originalCanvasHeight * 0.5
    );
  }

  update() {
    this.countdown.update();
  }

  paint() {
    for (let background of this.backgrounds) {
      background.paint();
    }
    this.countdown.paint();

    if (this.finished) {
      this.results.paint();
    }
  }

  processControls() {
    if (this.finished) {
      this.results.processControls();
    }
    // Eje Y
    if (controls.moveY > 0) {
    } else if (controls.moveY < 0) {
      
    } else {
    }
  }

  calculateTaps(taps) {
    if (this.finished) {
      this.results.calculateTaps(taps);
    }
  }

  start(state) {
    disableKeyboardInput();

    for (let element of state.elements) {
      switch (element) {
        case 1:
          break;
        case 2:
          break;
        case 3:
          break;
        default:
          break;
      }
    }

    this.countdown.start();
    setTimeout(() => {
    }, 3000);
  }

  updateGameState(state) {

    if (this.finished) {
      this.results.updateGameState(state);
    }
  }

  finish(state) {
    this.finished = true;
    this.results.updateGameState(state);
  }
}
