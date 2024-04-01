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

    this.movementsQueue = new MovementsQueue("back");
  }

  update() {
    this.wheel2.update();

    for (let player of this.players) {
      player.update();
    }

    if (this.moves.length >= this.round) {
      socket.emit("action", { movements: this.moves });
      this.moves = [];
      this.movementsQueue.clear();
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
    this.movementsQueue.paint();
  }

  initialize(state) {
    this.round = state.round;

    let player = state.players.find((p) => p.id == socketId);
    let opponent = state.players.find((p) => p.id != socketId);

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
            this.wheel2.middle();
            this.moves.push("middle");
            this.movementsQueue.addMovement("space");
            break;
          case "ArrowUp":
            this.wheel2.up();
            this.moves.push("up");
            this.movementsQueue.addMovement("up");
            break;
          case "ArrowDown":
            this.wheel2.down();
            this.moves.push("down");
            this.movementsQueue.addMovement("down");
            break;
          case "ArrowRight":
            this.wheel2.right();
            this.moves.push("right");
            this.movementsQueue.addMovement("right");
            break;
          case "ArrowLeft":
            this.wheel2.left();
            this.moves.push("left");
            this.movementsQueue.addMovement("left");
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
    switch (state.result.status) {
      case Statuses.WAITING:
        this.status.value = "Esperando jugadores...";
        break;
      case Statuses.PLAYING:
        this.isTurn = false;
        this.round = state.round;
        if (state.movementsToPlay.length > 0) {
          for (let movement of state.movementsToPlay) {
            console.log(movement);
          }
        }
        if (state.currentPlayer.id == socketId) {
          this.currentTurn = "Tu turno! ";
          this.isTurn = true;
        } else {
          let opponent = state.players.find((p) => p.id != socketId).playerName;
          this.currentTurn = "Turno de " + opponent + ": ";
        }

        break;
      case Statuses.WIN:
        if (state.movementsToPlay.length > 0) {
          for (let movement of state.movementsToPlay) {
            console.log(movement);
          }
        }
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
