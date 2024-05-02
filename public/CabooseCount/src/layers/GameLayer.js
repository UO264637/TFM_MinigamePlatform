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

    this.background5 = new Background(
      images.background5,
      originalCanvasWidth * 0.5,
      originalCanvasHeight * 0.5
    );

    this.status = new Text(
      "",
      "#563F2E",
      originalCanvasWidth * 0.01,
      originalCanvasHeight * 0.1
    );
  }

  update() {
    this.countdown.update();

    for (let car of this.cars) {
      car.update();
    }
  }

  paint() {
    for (let background of this.backgrounds) {
      background.paint();
    }

    this.status.paint();

    for (let car of this.cars) {
      car.paint();
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

    this.loadTrain(state.elements);

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

  loadTrain(passengers) {
    let carX = 0;
    let carY = 200;
    let car = new Car(images.engine, carX, carY, 0);
    //this.cars.push(car);
    
    
    for (let element of passengers) {
      if (car.isFull()) {
        carX -= 1300;
        this.cars.push(car);
        car = new Car(images.car, carX, carY, 8);
      }
      car.addPassenger(element);
    }

    this.cars.push(car);
    car = new Car(images.caboose, carX-1300, carY, 0);
    this.cars.push(car);
  }


  updateTurnTimer(secondsLeft) {
    this.status.value = secondsLeft + "s...";
  }
}
