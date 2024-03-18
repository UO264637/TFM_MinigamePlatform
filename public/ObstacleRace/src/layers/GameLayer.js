class GameLayer extends Layer {
  constructor() {
    super();
    this.speed = 0;
    this.baseSpeed = -8;
    this.start();
  }

  start() {
    this.space = new Space(1);
    this.backgrounds = [];
    this.obstacles = [];
    this.obstacleIndicators = [];
    this.floorY = originalCanvasHeight - 200;
    this.airY = originalCanvasHeight - 290;

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

    this.status = new CenteredText(0, "#FFFFFF", canvas.width * 0.5, canvas.height * 0.07);
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
    }
    else {
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
        socket.emit("action", { obstaclesLeft: this.obstacleIndicators.length });
      }
    }

    this.hud.update();
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

    this.status.paint();
    this.hud.paint();
  }

  processControls() {
    // Eje Y
    if (controls.moveY > 0) {
      this.player.jump();
    } else if (controls.moveY < 0) {
      this.player.crouch();
    }
    else {
      this.player.standUp();
    }
  }

  initialize(state) {
    this.speed = this.baseSpeed;
    let xPos = 1000;
    for (let obstaclePosition of state.obstacles) {
      if (obstaclePosition == 0) {
        let obstacle = new AnimatedObstacle(images.floor_obstacle1, images.floor_obstacle1_anim, xPos, this.floorY);
        this.obstacles.push(obstacle);
        let obstacleIndicator = new Obstacle(images.obstacle_indicator, xPos + 270, originalCanvasHeight / 2);
        this.obstacleIndicators.push(obstacleIndicator);
      } else {
        let obstacle = new AnimatedObstacle(images.air_obstacle1, images.air_obstacle1_anim, xPos, this.airY);
        this.obstacles.push(obstacle);
        let obstacleIndicator = new Obstacle(images.obstacle_indicator, xPos + 270, originalCanvasHeight / 2);
        this.obstacleIndicators.push(obstacleIndicator);
      }
      xPos += 1000;
    }
    this.obstacles.pop();
    let lastIndicator = this.obstacleIndicators[this.obstacleIndicators.length - 1];
    this.goal = new AnimatedObstacle(images.goal, images.goal_anim, lastIndicator.x - 180, originalCanvasHeight - 290);
    this.player.run();
  }

  updateGameState(state) {
    this.status.value = "";
    switch (state.result.status) {
      case Statuses.WAITING:
        this.status.value = "Esperando jugadores...";
        break;
      case Statuses.PLAYING:
        this.hud.updatePlayerPositions(state);
        break;
      case Statuses.DRAW:
        this.player.stop();
        this.speed = 0;
        this.status.value = "Empate!";
        break;
      case Statuses.WIN:
        this.player.stop();
        this.speed = 0;
        this.status.value = "Ha ganado " + state.result.winner.playerName + "!";
        break;
      default:
        break;
    }
  }
}
