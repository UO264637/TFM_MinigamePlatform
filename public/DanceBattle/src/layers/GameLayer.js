class GameLayer extends Layer {
  constructor() {
    super();
    this.start();
    this.turnTimer = 0;
  }

  start() {
    this.players = [];
    this.round = 3;
    this.isTurn = true;
    this.moves = [];

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
    this.status = new CenteredText(
      0,
      "#563F2E",
      originalCanvasWidth * 0.5,
      originalCanvasHeight * 0.1
    );

    this.wheel2 = new MovementsWheel(
      originalCanvasWidth * 0.45,
      originalCanvasHeight * 0.475
    );

    this.movements = new Text(
      "·  ·  ·",
      "#FFFFFF",
      originalCanvasWidth * 0.45,
      originalCanvasHeight * 0.95,
      30
    );

    this.right = new Background(
      images.right,
      originalCanvasWidth * 0.2,
      originalCanvasHeight * 0.94
    );
  }

  update() {
    if (this.moves.length >= this.round) {
      console.log("s")
      socket.emit("action", { movements: this.moves });
      this.moves = [];
    }
  }

  paint() {
    this.background.paint();

    for (let player of this.players) {
      player.paint();
    }

    if (this.isTurn) {
      this.wheel2.paint();
    }

    this.status.paint();

    if (this.isTurn) {
      this.turnIndicator.paint();
    }
    this.movements.paint();
    this.right.paint();
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

    let player = state.players.find(p => p.id == socketId);
    let opponent = state.players.find(p => p.id != socketId);

    this[player.role] = new Player(
      originalCanvasWidth * 0.3,
      originalCanvasHeight * 0.575,
      player.playerName,
      "back"
    );
    this.players.push(this[player.role]);

    this[opponent.role] = new Player(
      originalCanvasWidth * 0.75,
      originalCanvasHeight * 0.3,
      opponent.playerName,
      "front"
    );
    this.players.push(this[opponent.role]);
  }

  processControls() {
    if (this.isTurn) {
      for (let i = 0; i < keysPressed.length; i++) {
        let key = keysPressed[i];
        switch (key) {
          case "Space":
            this.movements.value = this.movements.value.replace(/\·/, "-");
            this.wheel2.middle();
            this.moves.push("middle");
            break;
          case "ArrowUp":
            this.movements.value = this.movements.value.replace(/\·/, "u");
            this.wheel2.up();
            this.moves.push("up");
            break;
          case "ArrowDown":
            this.movements.value = this.movements.value.replace(/\·/, "d");
            this.wheel2.down();
            this.moves.push("down");
            break;
          case "ArrowRight":
            this.movements.value = this.movements.value.replace(/\·/, "r");
            this.wheel2.right();
            this.moves.push("right");
            break;
          case "ArrowLeft":
            this.movements.value = this.movements.value.replace(/\·/, "l");
            this.wheel2.left();
            this.moves.push("left");
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
          console.log("a");
          for (let movement of state.movementsToPlay) {
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
  }

  updateTurnTimer(secondsLeft) {
    this.status.value = this.currentTurn + secondsLeft + "s...";
  }
}
