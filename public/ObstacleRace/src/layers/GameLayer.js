class GameLayer extends Layer {
  constructor() {
    super();
    this.speed = 0;
    this.baseSpeed = -7;
    this.start();
  }

  start() {
    this.space = new Space(1);
    this.backgrounds = [];
    this.obstacles = [];
    this.obstacleIndicators = [];
    this.floorY = originalCanvasHeight - 200;
    this.airY = originalCanvasHeight - 300;

    this.player = new Player(150, originalCanvasHeight - 200);
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
    this.backgrounds.push(this.background5);

    let floor = new Background(
      images.floor,
      originalCanvasWidth * 0.5,
      originalCanvasHeight - 50
    );
    this.space.addStaticCorp(floor);

    this.status = new CenteredText(0, canvas.width * 0.5, canvas.height * 0.07);
    this.hud = new HUDLayer();
  }

  update() {
    this.background1.xv = this.speed + 4;
    this.background2.xv = this.speed + 3;
    this.background3.xv = this.speed + 2;
    this.background4.xv = this.speed + 1;
    this.background5.xv = this.speed - 1;
    this.floor_background.xv = this.speed;

    this.space.update();
    for (let background of this.backgrounds) {
      background.update();
    }

    this.player.update();

    // Eliminar obstaculos fuera de pantalla
    /*for (var i=0; i < this.disparosJugador.length; i++){
      if ( this.disparosJugador[i] != null &&
          !this.disparosJugador[i].estaEnPantalla()){
          this.espacio
              .eliminarCuerpoDinamico(this.disparosJugador[i]);
          this.disparosJugador.splice(i, 1);
      }
  } */

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
      }
    }

    for (const obstacleIndicator of this.obstacleIndicators) {
      if (this.player.collides(obstacleIndicator)) {
        this.speed -= 1;
        this.obstacleIndicators.splice(0, 1);
        socket.emit("action", {});
      }
    }

    this.hud.update();
  }

  paint() {
    for (let background of this.backgrounds) {
      background.paint();
    }
    this.player.paint();

    for (const obstacle of this.obstacles) {
      obstacle.paint();
    }

    for (const obstacle_indicator of this.obstacleIndicators) {
      obstacle_indicator.paint();
    }

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
  }

  initialize(state) {
    this.speed = this.baseSpeed;
    let xPos = 1000;
    for (let obstaclePosition of state.obstacles) {
      if (obstaclePosition == 0) {
        let obstacle = new Obstacle(images.floorObstacle, xPos, this.floorY);
        this.obstacles.push(obstacle);
        let obstacleIndicator = new Obstacle(images.obstacle_indicator, xPos+270, originalCanvasHeight/2);
        this.obstacleIndicators.push(obstacleIndicator);
      } else {
        let obstacle = new Obstacle(images.airObstacle, xPos, this.airY);
        this.obstacles.push(obstacle);
        let obstacleIndicator = new Obstacle(images.obstacle_indicator, xPos+270, originalCanvasHeight/2);
        this.obstacleIndicators.push(obstacleIndicator);
      }
      xPos += 1000;
    }
  }

  updateGameState(state) {
    this.status.value = "";
    switch (state.result.status) {
      case Statuses.WAITING:
        this.status.value = "Esperando jugadores...";
        break;
      case Statuses.PLAYING:
        break;
      case Statuses.DRAW:
        this.speed = 0;
        this.status.value = "Empate!";
        break;
      case Statuses.WIN:
        this.speed = 0;
        this.status.value = "Ha ganado " + state.result.winner.playerName + "!";
        break;
      default:
        break;
    }
  }
}
