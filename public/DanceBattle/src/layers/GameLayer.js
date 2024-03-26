class GameLayer extends Layer {
  constructor() {
    super();
    this.start();
    this.turnTimer = 0;
  }

  start() {
    this.board = [];
    this.round = 3;
    this.isTurn = true;

    this.background = new Background(
      images.background,
      originalCanvasWidth * 0.5,
      originalCanvasHeight * 0.5
    );
    this.turnIndicator = new Background(
      images.turnIndicator,
      originalCanvasWidth * 0.5,
      originalCanvasHeight * 0.5
    );
    this.player1 = new Text(
      0,
      "#563F2E",
      originalCanvasWidth * 0.07,
      originalCanvasHeight * 0.47
    );
    this.player2 = new Text(
      0,
      "#563F2E",
      originalCanvasWidth * 0.07,
      originalCanvasHeight * 0.53
    );
    this.status = new CenteredText(
      0,
      "#563F2E",
      originalCanvasWidth * 0.5,
      originalCanvasHeight * 0.1
    );
    this.status.value = "";
    this.wheel1 = new MovementsWheel(
      originalCanvasWidth * 0.4,
      originalCanvasHeight * 0.45
    );
    this.wheel2 = new MovementsWheel(
      originalCanvasWidth * 0.6,
      originalCanvasHeight * 0.8
    );

    this.movements = new Text(
      "·  ·  ·",
      "#FFFFFF",
      originalCanvasWidth * 0.45,
      originalCanvasHeight * 0.95,
      30
    );
  }

  update() {
    if (this.movements.length >= this.round) {
      socket.emit("action", { movements: this.movements });
    }
  }

  paint() {
    this.background.paint();

    this.player1.paint();
    this.player2.paint();
    if (this.isTurn) {
      this.wheel2.paint();
    } else {
      this.wheel1.paint();
    }
    this.status.paint();

    if (this.isTurn) {
      this.turnIndicator.paint();
    }
    this.movements.paint();
  }

  calculateTaps(taps) {
    // for (let i = 0; i < 9; i++) {
    //   this.board[i].pressed = false;
    // }
    // for (const tap of taps) {
    //   for (let i = 0; i < 9; i++) {
    //     if (this.board[i].containsPoint(tap.x, tap.y)) {
    //       if (tap.type == tapType.start) {
    //         socket.emit("action", {
    //           gridIndex: i,
    //         });
    //         break;
    //       }
    //     }
    //   }
    // }
  }

  initialize(state) {
    this.round = state.round;
  }

  processControls() {
    if (this.isTurn) {
      for (let i = 0; i < keysPressed.length; i++) {
        let key = keysPressed[i];
        switch (key) {
          case "Space":
            this.movements.value = this.movements.value.replace(/\·/, "-");
            this.wheel2.middle();
            break;
          case "ArrowUp":
            this.movements.value = this.movements.value.replace(/\·/, "u");
            this.wheel2.up();
            break;
          case "ArrowDown":
            this.movements.value = this.movements.value.replace(/\·/, "d");
            this.wheel2.down();
            break;
          case "ArrowRight":
            this.movements.value = this.movements.value.replace(/\·/, "r");
            this.wheel2.right();
            break;
          case "ArrowLeft":
            this.movements.value = this.movements.value.replace(/\·/, "l");
            this.wheel2.left();
            break;
        }
        keysPressed.splice(i, 1);
        i--;
      }
    } else {
      keysPressed.length = 0;
    }
  }

  updateGameState(state) {
    // for (let i = 0; i < state.board.length; i++) {
    //   const player = state.board[i];
    //   if (player != null) {
    //     this.board[i].image.src = images[player.symbol];
    //   }
    // }

    switch (state.result.status) {
      case Statuses.WAITING:
        this.status.value = "Esperando jugadores...";
        break;
      case Statuses.PLAYING:
        if (state.movementsToPlay.length > 0) {
          for (let movement of movementsToPlay) {
            console.log(movement);
          }
          socket.emit("action", { movements: state.currentPlayer.movements });
        } else {
          if (state.currentPlayer.id == socketId) {
            this.currentTurn = "Tu turno! ";
            this.isTurn = true;
          } else {
            let opponent = state.players.find(
              (p) => p.id != socketId
            ).playerName;
            this.currentTurn = "Turno de " + opponent + ": ";
            this.isTurn = false;
          }
        }
        break;
      case Statuses.DRAW:
        this.status.value = "Empate!";
        this.isTurn = false;
        break;
      case Statuses.WIN:
        this.status.value =
          "Ha ganado " + state.result.winner.playerName + "! ";
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
