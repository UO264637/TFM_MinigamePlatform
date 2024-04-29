class GameLayer extends Layer {
  constructor() {
    super();
    this.results = new ResultsLayer();
    this.initialize();
  }

  initialize() {
    this.countdown = new Countdown();
    this.space = new Space(1);
    this.backgrounds = [];
    this.obstacles = [];
    this.obstacleIndicators = [];
    this.floorY = originalCanvasHeight - 200;
    this.airY = originalCanvasHeight - 290;
    this.speed = 0;
    this.baseSpeed = -8;

    this.player = new Player(150, originalCanvasHeight - 182);
    this.space.addDinamicCorp(this.player);

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

    let floor = new Background(
      images.floor,
      originalCanvasWidth * 0.5,
      originalCanvasHeight - 50
    );
    this.space.addStaticCorp(floor);

    this.hud = new HUDLayer();
    this.goal = new Obstacle(images.obstacle_indicator, 10000, 0);
  }

  update() {
    if (this.speed != 0) {
      this.background1.xv = this.speed + 8;
      this.background2.xv = this.speed + 6;
      this.background3.xv = this.speed + 4;
      this.background4.xv = this.speed + 2;
      this.background5.xv = this.speed - 2;
    } else {
      for (let background of this.backgrounds) {
        background.xv = 0;
      }
      this.background5.xv = 0;
    }
    this.floor_background.xv = this.speed;

    this.space.update();
    for (let background of this.backgrounds) {
      background.update();
    }

    this.background5.update();

    this.goal.xv = this.speed;
    this.goal.update();
    this.player.update();

    for (const obstacle of this.obstacles) {
      obstacle.xv = this.speed;
      obstacle.update();
    }

    for (const obstacle_indicator of this.obstacleIndicators) {
      obstacle_indicator.xv = this.speed;
      obstacle_indicator.update();
    }

    for (const obstacle of this.obstacles) {
      if (this.player.collidesCircle(obstacle)) {
        this.speed = this.baseSpeed;
        this.player.hit();
      }
    }

    for (const obstacleIndicator of this.obstacleIndicators) {
      if (this.player.collides(obstacleIndicator)) {
        this.speed -= 1;
        this.obstacleIndicators.splice(0, 1);
        socket.emit("action", {
          obstaclesLeft: this.obstacleIndicators.length,
        });
      }
    }

    this.hud.update();
    this.countdown.update();
  }

  paint() {
    for (let background of this.backgrounds) {
      background.paint();
    }

    this.goal.paint();
    this.player.paint();

    for (const obstacle of this.obstacles) {
      obstacle.paint();
    }

    this.background5.paint();
    this.hud.paint();
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
      this.player.jump();
    } else if (controls.moveY < 0) {
      this.player.crouch();
    } else {
      this.player.standUp();
    }
  }

  calculateTaps(taps) {
    if (this.finished) {
      this.results.calculateTaps(taps);
    }
  }

  start(state) {
    disableKeyboardInput();

    let xPos = 1000;
    for (let obstaclePosition of state.obstacles) {
      if (obstaclePosition == 0) {
        let obstacle = new AnimatedObstacle(
          images.floor_obstacle1,
          images.floor_obstacle1_anim,
          xPos,
          this.floorY
        );
        this.obstacles.push(obstacle);
        let obstacleIndicator = new Obstacle(
          images.obstacle_indicator,
          xPos + 270,
          originalCanvasHeight / 2
        );
        this.obstacleIndicators.push(obstacleIndicator);
      } else {
        let obstacle = new AnimatedObstacle(
          images.air_obstacle1,
          images.air_obstacle1_anim,
          xPos,
          this.airY
        );
        this.obstacles.push(obstacle);
        let obstacleIndicator = new Obstacle(
          images.obstacle_indicator,
          xPos + 270,
          originalCanvasHeight / 2
        );
        this.obstacleIndicators.push(obstacleIndicator);
      }
      xPos += 1000;
    }
    this.obstacles.pop();
    let lastIndicator =
      this.obstacleIndicators[this.obstacleIndicators.length - 1];
    this.goal = new AnimatedObstacle(
      images.goal,
      images.goal_anim,
      lastIndicator.x - 180,
      originalCanvasHeight - 290
    );

    this.countdown.start();
    setTimeout(() => {
      this.speed = this.baseSpeed;
      this.player.run();
    }, 3000);
  }

  updateGameState(state) {
    if (state.result.status == Statuses.PLAYING) {
      this.hud.updatePlayerPositions(state);
    }

    if (this.finished) {
      this.results.updateGameState(state);
    }
  }

  finish(state) {
    this.player.stop();
    this.speed = 0;
    this.finished = true;
    this.results.updateGameState(state);
  }
}
