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
    this.countingTime = false;

    this.caboose = new Car(images.caboose, images.car_bg, 0, 0, 0);

    this.countInput = new CountInput(
      images.count_input,
      originalCanvasWidth * 0.5,
      originalCanvasHeight * 0.5
    );

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

    if (!this.countingTime && this.caboose.x > originalCanvasWidth) {
      socket.emit("action", {
        readyToCount: true,
      });
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

    if (this.countdown.value != null) {
      this.passengerToCount.paint();
    }

    this.countdown.paint();

    if (this.countingTime) {
      this.countInput.paint();
    }

    if (this.finished) {
      this.results.paint();
    }
  }

  processControls() {
    if (this.finished) {
      this.results.processControls();
    } else if (this.countingTime) {
      if (controls.moveY > 0) {
        this.countInput.increase();
      } else if (controls.moveY < 0) {
        this.countInput.decrease();
      }
      controls.moveY = 0;
    }
  }

  calculateTaps(taps) {
    if (this.finished) {
      this.results.calculateTaps(taps);
    }
  }

  start(state) {
    disableKeyboardInput();

    this.passengerToCount = new Background(images["passenger" + state.toCount], 640, 200);

    this.countdown.start();
    setTimeout(() => {
      this.loadTrain(state.elements);
    }, 3000);
  }

  updateGameState(state) {
    if (state.readyToCount) {
      this.countingTime = true;
    }
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
    let car = new Car(images.car, images.car_bg, carX, carY, 0);

    for (let element of passengers) {
      if (car.isFull()) {
        carX -= 1095;
        this.cars.push(car);
        car = new Car(images.car, images.car_bg, carX, carY, 8);
      }
      car.addPassenger(element);
    }
    this.cars.push(car);
    car.background.src = images.caboose;
    this.caboose = car;
  }

  updateTurnTimer(secondsLeft) {
    this.status.value = secondsLeft + "s...";
    if (secondsLeft <= 0) {
      this.resultsTime = true;
      this.countInput.emitValue();
    }
  }
}
