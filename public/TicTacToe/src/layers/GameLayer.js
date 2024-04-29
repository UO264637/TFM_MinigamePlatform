class GameLayer extends Layer {
  constructor() {
    super();
    this.results = new ResultsLayer();
    this.initialize();
  }

  initialize() {
    this.countdown = new Countdown();
    this.turnTimer = 0;
    this.board = [];

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        this.board[i + j + i * 2] = new Button(
          images.tttButton,
          canvas.width / 2 - 155 + i * 155,
          canvas.height / 2 - 155 + j * 155
        );
      }
    }

    this.background = new Background(
      images.board,
      canvas.width * 0.5,
      canvas.height * 0.5
    );
    this.turnIndicator = new Background(
      images.turnIndicator,
      canvas.width * 0.5,
      canvas.height * 0.5
    );
    this.player1 = new Text(
      "",
      "#563F2E",
      canvas.width * 0.07,
      canvas.height * 0.47
    );
    this.player2 = new Text(
      "",
      "#563F2E",
      canvas.width * 0.07,
      canvas.height * 0.53
    );
    this.status = new CenteredText(
      "",
      "#563F2E",
      canvas.width * 0.5,
      canvas.height * 0.1
    );
    this.status.value = "";
  }

  update() {
    this.countdown.update();
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

    this.countdown.paint();
    if (this.finished) {
      this.results.paint();
    }
  }

  processControls() {
    if (this.finished) {
      this.results.processControls();
    }
  }

  calculateTaps(taps) {
    if (this.finished) {
      this.results.calculateTaps(taps);
    }

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

  start(state) {
    disableTapInput();
    this.player1.value =
      state.players[0].symbol + ": " + state.players[0].playerName;

    this.player2.value =
      state.players[1].symbol + ": " + state.players[1].playerName;
    this.countdown.start();
  }

  updateGameState(state) {
    for (let i = 0; i < state.board.length; i++) {
      const player = state.board[i];
      if (player != null) {
        this.board[i].image.src = images[player.symbol];
      }
    }

    if (state.result.status == Statuses.PLAYING) {
      if (state.currentPlayer.id == socketId) {
        this.currentTurn = "Tu turno! ";
        this.isTurn = true;
      } else {
        let opponent = state.players.find((p) => p.id != socketId).playerName;
        this.currentTurn = "Turno de " + opponent + ": ";
        this.isTurn = false;
      }
    }

    if (this.finished) {
      this.results.updateGameState(state);
    }
  }

  finish(state) {
    this.status.value = "";
    this.isTurn = false;
    this.finished = true;
    this.results.updateGameState(state);
  }

  updateTurnTimer(secondsLeft) {
    this.status.value = this.currentTurn + secondsLeft + "s...";
  }
}
