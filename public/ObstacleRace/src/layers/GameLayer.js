class GameLayer extends Layer {

  constructor() {
    super();
    this.start();
  }

  start() {
    this.space = new Space(1);

    this.player = new Player(50, 50);
    this.space.addDinamicCorp(this.player);
    this.background = new Background(images.background, originalCanvasWidth * 0.5, originalCanvasHeight * 0.5);
    var floor = new Background(images.floor, originalCanvasWidth * 0.5, originalCanvasHeight-50);
    this.space.addStaticCorp(floor);
    
    this.obstacles = [];
    var obstacle1 = new Obstacle(350,50);
    var obstacle2 = new Obstacle(600,450);

    this.obstacles.push(obstacle1);
    this.obstacles.push(obstacle2);
    this.space.addStaticCorp(obstacle1);
    this.space.addStaticCorp(obstacle2);

    this.player1 = new Text(0, canvas.width * 0.07, canvas.height * 0.47);
    this.player2 = new Text(0, canvas.width * 0.07, canvas.height * 0.53);
    this.status = new CenteredText(0, canvas.width * 0.5, canvas.height * 0.07);
  }

  update() {
    this.space.update();
    this.background.xv = -1;
    this.background.update();

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


    for (var i=0; i < this.obstacles.length; i++){
      this.obstacles[i].update();
    }

/*     for (var i=0; i < this.obstacles.length; i++){
      if ( this.player.collides(this.obstacles[i])){
          this.start();
      }
  } */

  }

  paint() {
    this.background.paint();
    this.player.paint();

    for (var i=0; i < this.obstacles.length; i++){
      this.obstacles[i].paint();
    }

    this.player1.paint();
    this.player2.paint();
    this.status.paint();
  }

  processControls() {
    // disparar
    if (controls.disparo) {

    }

    // Eje X
    if (controls.moveX > 0) {
      this.player.moveX(1);

    } else if (controls.moveX < 0) {
      this.player.moveX(-1);

    } else {
      this.player.moveX(0);
    }

    // Eje Y
    if (controls.moveY > 0) {
      this.player.jump();
    }
  }

  calculateTaps(taps) {
    
  }

  updateGameState(state) {
    for (let i = 0; i < state.board.length; i++) {
      const player = state.board[i];
      if (player != null) {
        this.board[i].image.src = images[player.symbol]
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
        this.status.value = "Turno de " + state.currentPlayer.playerName;
        break;
      case Statuses.DRAW:
        this.status.value = "Empate!";
        //console.log("Draw! \nPress R for rematch");
        break;
      case Statuses.WIN:
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