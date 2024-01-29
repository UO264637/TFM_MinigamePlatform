class GameLayer extends Layer {

  constructor() {
    super();
    this.start();
  }

  start() {
    this.board = [];

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        this.board[i + j + i * 2] = new Button(images.tttButton, canvas.width / 2 - 155 + i * 155, canvas.height / 2 - 155 + j * 155);
      }
    }

    this.background = new Background(images.board, canvas.width * 0.5, canvas.height * 0.5);
    this.player1 = new Text(0, canvas.width * 0.07, canvas.height * 0.47);
    this.player2 = new Text(0, canvas.width * 0.07, canvas.height * 0.53);
    this.status = new CenteredText(0, canvas.width * 0.5, canvas.height * 0.1);
  }

  paint() {
    this.background.paint();

    for (let i = 0; i < 9; i++) {
      this.board[i].paint();
    }

    this.player1.paint();
    this.player2.paint();
    this.status.paint();
  }

  calculateTaps(taps) {

    for (let i = 0; i < 9; i++) {
      this.board[i].pressed = false;
    }

    for (var k = 0; k < taps.length; k++) {
      for (let i = 0; i < 9; i++) {
        if (this.board[i].containsPoint(taps[k].x, taps[k].y)) {
          if (taps[k].type == tapType.start) {
            socket.emit("action", {
              gridIndex: i,
            });
            break;
          }

        }
      }
    }
  }

  updateGameState(state) {
    for (let i = 0; i < state.board.length; i++) {
      const player = state.board[i];
      if (player != null) {
        this.board[i].image.src = images[player.symbol];
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
