class GameLayer extends Layer {
  constructor() {
    super();
    this.start();
    this.speed = -5;
  }

  start() {
    this.space = new Space(1);
    this.backgrounds = [];

    this.player = new Player(150, originalCanvasHeight - 200);
    this.space.addDinamicCorp(this.player);
    this.background = new Background(
      images.background,
      originalCanvasWidth * 0.5,
      originalCanvasHeight * 0.5
    );
    this.backgrounds.push(this.background);

    this.background1 = new Background(
      images.background1,
      originalCanvasWidth * 0.5,
      originalCanvasHeight * 0.5
    );
    this.backgrounds.push(this.background1);

    this.background2 = new Background(
      images.background2,
      originalCanvasWidth * 0.5,
      originalCanvasHeight * 0.5
    );
    this.backgrounds.push(this.background2);

    this.background3 = new Background(
      images.background3,
      originalCanvasWidth * 0.5,
      originalCanvasHeight * 0.5
    );
    this.backgrounds.push(this.background3);

    this.background4 = new Background(
      images.background4,
      originalCanvasWidth * 0.5,
      originalCanvasHeight * 0.5
    );
    this.backgrounds.push(this.background4);

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

    this.obstacles = [];
    let obstacle1 = new Obstacle(150, originalCanvasHeight - 300);
    let obstacle2 = new Obstacle(600, originalCanvasHeight - 175);

    this.obstacles.push(obstacle1);
    this.obstacles.push(obstacle2);

    this.player1 = new Text(0, canvas.width * 0.07, canvas.height * 0.47);
    this.player2 = new Text(0, canvas.width * 0.07, canvas.height * 0.53);
    this.status = new CenteredText(0, canvas.width * 0.5, canvas.height * 0.07);
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

    /*     // Eliminar disparos fuera de pantalla
    for (var i=0; i < this.disparosJugador.length; i++){
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

    /*     for (var i=0; i < this.obstacles.length; i++){
      if ( this.player.collides(this.obstacles[i])){
          this.start();
      }
  } */
  }

  paint() {
    for (let background of this.backgrounds) {
      background.paint();
    }
    this.player.paint();

    for (const obstacle of this.obstacles) {
      obstacle.paint();
    }

    this.player1.paint();
    this.player2.paint();
    this.status.paint();
  }

  processControls() {
    // Eje Y
    if (controls.moveY > 0) {
      this.player.jump();
    } else if (controls.moveY < 0) {
      this.player.crouch();
    }
  }

  calculateTaps(taps) {
    for (const tap of taps) {
      if (tap.type == tapType.start) {
        this.player.jump();
        break;
      }
    }
  }

  updateGameState(state) {
    for (let i = 0; i < state.board.length; i++) {
      const player = state.board[i];
      if (player != null) {
        this.board[i].image.src = images[player.symbol];
      } else {
        //boardSquares[index].textBox.text = "";
      }
    }

    this.status.value = "";
    switch (state.result.status) {
      case Statuses.WAITING:
        this.status.value = "Esperando jugadores...";
        break;
      case Statuses.PLAYING:
        if (this.obstacles.length == 0) {
          this.speed = -5;
          for (obstaclePosition of state.obstacles) {
            if (obstaclePosition == 0) {
              let obstacle = new Obstacle(images.mushroom,)
            }
            else {

            }

          }
        }
        this.status.value = "Turno de " + state.currentPlayer.playerName;
        break;
      case Statuses.DRAW:
        this.speed = 0;
        this.status.value = "Empate!";
        //console.log("Draw! \nPress R for rematch");
        break;
      case Statuses.WIN:
        this.speed = 0;
        this.status.value = "Ha ganado " + state.result.winner.playerName + "!";
        break;
      default:
        break;
    }

    this.player1.value = "";
    this.player2.value = "";
    if (state.players.length > 0) {
      this.player1.value =
        state.players[0].symbol + ": " + state.players[0].playerName;
    }

    if (state.players.length > 1) {
      this.player2.value =
        state.players[1].symbol + ": " + state.players[1].playerName;
    }
  }
}
