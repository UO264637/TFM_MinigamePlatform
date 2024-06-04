class GameLayer extends Layer {
  constructor() {
    super();
    this.initialize();
  }

  initialize() {
    this.countdown = new Countdown();
    this.backgrounds = [];
    this.cars = [];
    this.floorY = originalCanvasHeight - 200;
    this.countingTime = false;
    this.resultsTime = false;

    this.caboose = new Car(images.caboose, images.car_bg, 0, 0, 0);

    this.countInput = new CountInput(
      images.count_input,
      originalCanvasWidth * 0.5,
      originalCanvasHeight * 0.5
    );

    this.background = new Background(
      images.background,
      originalCanvasWidth * 0.5,
      originalCanvasHeight * 0.5
    );

    this.status = new CenteredText(
      "",
      "#563F2E",
      originalCanvasWidth * 0.5,
      originalCanvasHeight * 0.1,
      32
    );

    this.player = new Player(
      images.player,
      images.player_solution,
      originalCanvasWidth * 0.4,
      originalCanvasHeight * 0.96,
      "left"
    );

    this.opponent = new Player(
      images.opponent,
      images.opponent_solution,
      originalCanvasWidth * 0.6,
      originalCanvasHeight * 0.96,
      "right"
    );

    this.characterBg = new CountInput(images.character_background, 640, 200);
    this.loadTrain();
  }

  update() {
    this.countdown.update();
    this.countInput.update();

    for (let car of this.cars) {
      car.update();
    }

    if (!this.countingTime && !this.resultsTime && this.caboose.x > originalCanvasWidth) {
      socket.emit("action", {
        readyToCount: true,
      });
    }
  }

  paint() {
    this.background.paint();

    for (let car of this.cars) {
      car.paint();
    }

    this.player.paint(this.resultsTime);
    this.opponent.paint(this.resultsTime);

    if (this.countdown.value != null || this.resultsTime) {
      this.status.paint();
      this.characterBg.paint();
      this.passengerToCount.paint();
    }

    this.countdown.paint();

    if (this.countingTime && !this.resultsTime) {
      this.countInput.paint();
    }
  }

  processControls() {
    if (this.countingTime) {
      if (controls.moveY > 0) {
        this.countInput.increase();
      } else if (controls.moveY < 0) {
        this.countInput.decrease();
      } else if (controls.moveY == 0) {
        this.countInput.stop();
      }
    }
  }

  start(state) {
    disableKeyboardInput();
    this.resultsTime = false;
    this.fillTrain(state.elements);
    playEffect(soundEffects.train);

    this.passengerToCount = new Background(
      images["passenger" + state.toCount],
      640,
      200
    );

    let player = state.players.find((p) => p.id == socketId);
    let opponent = state.players.find((p) => p.id != socketId);
    this.player.setName(player.playerName);
    this.opponent.setName(opponent.playerName);

    this.countdown.start();
    setTimeout(() => {
      for (let car of this.cars) {
        car.startUp();
      }
      playMusic();      
    }, 3000);
  }

  updateGameState(state) {
    if (state.readyToCount) {
      this.countingTime = true;
    }
    if (this.resultsTime) {
      let player = state.players.find((p) => p.id == socketId);
      let opponent = state.players.find((p) => p.id != socketId);

      this.status.value = "Resultado: " + state.solution;
      this.player.showResult(player.count);
      this.opponent.showResult(opponent.count);
    }
  }

  finish(state) {
    stopMusic();

    this.caboose.x = -600;
    this.cars = [];
    this.loadTrain();
    this.countdown = new Countdown();
    this.countInput.clear();
    this.status.value = "";
    this.countingTime = false;
  }

  loadTrain() {
    let carX = -600;
    let carY = 400;
    let car = new Car(images.engine, images.engine, carX, carY, 0);
    this.cars.push(car);

    for (let i = 0; i < 6; i++) {
      carX -= 1095;
      car = new Car(images.car, images.car_bg, carX, carY, 8);
      this.cars.push(car);
    }
    carX -= 1095;
    car = new Car(images.caboose, images.car_bg, carX, carY, 8);
    this.cars.push(car);
    this.caboose = car;
  }

  fillTrain(passengers) {
    let car = 0;

    for (let element of passengers) {
      if (this.cars[car].isFull()) {
        car++;
      }
      this.cars[car].addPassenger(element);
    }
  }

  updateTurnTimer(secondsLeft) {
    this.status.value = secondsLeft + "s...";
    if (secondsLeft <= 0) {
      playEffect(soundEffects.wood_sound);
      this.resultsTime = true;
      this.countInput.emitValue();
    }
  }
}
