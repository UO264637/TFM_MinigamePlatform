class GameLayer extends Layer {

  constructor() {
    super();
    this.start();
    this.turnTimer = 0;
  }

  start() {
    this.board = [];

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        this.board[i + j + i * 2] = new Button(images.tttButton, canvas.width / 2 - 155 + i * 155, canvas.height / 2 - 155 + j * 155);
      }
    }

    this.background = new Background(images.board, canvas.width * 0.5, canvas.height * 0.5);
    this.turnIndicator = new Background(images.turnIndicator, canvas.width * 0.5, canvas.height * 0.5);
    this.player1 = new Text(0, "#563F2E", canvas.width * 0.07, canvas.height * 0.47);
    this.player2 = new Text(0, "#563F2E", canvas.width * 0.07, canvas.height * 0.53);
    this.status = new CenteredText(0, "#563F2E", canvas.width * 0.5, canvas.height * 0.1);
    this.status.value = "";
  }

  paint() {
    this.background.paint();

    for (let i = 0; i < 9; i++) {
      this.board[i].paint();
    }

    this.player1.paint();
    this.player2.paint();
    this.status.paint();

    if (this.isTurn) {
      this.turnIndicator.paint();
    }
  }

  calculateTaps(taps) {
    for (let i = 0; i < 9; i++) {
      this.board[i].pressed = false;
    }

    for (const tap of taps) {
      for (let i = 0; i < 9; i++) {
        if (this.board[i].containsPoint(tap.x, tap.y)) {
          if (tap.type == tapType.start) {
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

    switch (state.result.status) {
      case Statuses.WAITING:
        this.status.value = "Esperando jugadores...";
        break;
      case Statuses.PLAYING:
        if (state.currentPlayer.id == socketId) {
          this.currentTurn = "Tu turno! ";
          this.isTurn = true;
        }
        else {
          let opponent = state.players.find((p) => p.id != socketId).playerName;
          this.currentTurn = "Turno de " + opponent + ": ";
          this.isTurn = false;
        }
        break;
      case Statuses.DRAW:
        this.status.value = "Empate!";
        this.isTurn = false;
        break;
      case Statuses.WIN:
        this.status.value = "Ha ganado " + state.result.winner.playerName + "! ";
        this.isTurn = false;
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

  updateTurnTimer(secondsLeft) {
    this.status.value = this.currentTurn + secondsLeft + "s...";
  }
}
