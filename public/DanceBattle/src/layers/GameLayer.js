class GameLayer extends Layer {
  constructor() {
    super();
    this.players = [];
    this.round = 3;
    this.isTurn = false;
    this.numMoves = 0;
    this.turnTimer = 0;
    this.start();
  }

  start() {
    this.background = new Background(
      images.background,
      originalCanvasWidth * 0.5,
      originalCanvasHeight * 0.5
    );

    this.roundIndicator = new Text(
      "Round 1",
      "#FFFFFF",
      originalCanvasWidth * 0.05,
      originalCanvasHeight * 0.1,
      32
    );

    this.status = new Text(
      "",
      "#FFFFFF",
      originalCanvasWidth * 0.05,
      originalCanvasHeight * 0.15
    );

    this.movementsWheel = new MovementsWheel(
      originalCanvasWidth * 0.45,
      originalCanvasHeight * 0.475
    );

    this.backPlayer = new Player(
      originalCanvasWidth * 0.3,
      originalCanvasHeight * 0.575,
      "",
      "back"
    );
    this.players.push(this.backPlayer);

    this.frontPlayer = new Player(
      originalCanvasWidth * 0.75,
      originalCanvasHeight * 0.3,
      "",
      "front"
    );
    this.players.push(this.frontPlayer);
  }

  update() {
    this.movementsWheel.update();

    for (let player of this.players) {
      player.update();
    }

    if (this.numMoves >= this.round) {
      socket.emit("action", {
        movements: this[this.ownRole].movementsQueue.movements,
      });
      this.numMoves = 0;
    }
  }

  paint() {
    this.background.paint();

    for (let player of this.players) {
      player.paint();
    }

    if (this.isTurn) {
      this.movementsWheel.paint();
    }

    this.status.paint();
    this.roundIndicator.paint();
  }

  initialize(state) {
    this.round = state.round;

    let player = state.players.find((p) => p.id == socketId);
    let opponent = state.players.find((p) => p.id != socketId);
    this.ownRole = player.role;

    this[player.role] = this.backPlayer;
    this[player.role].setName(player.playerName)
    this[opponent.role] = this.frontPlayer;
    this[opponent.role].setName(player.playerName)
  }

  processControls() {
    if (this.isTurn) {
      for (let i = 0; i < keysPressed.length; i++) {
        let key = keysPressed[i];
        switch (key) {
          case "Space":
            this.movementsWheel.middle();
            this[this.ownRole].movementsQueue.addMovement("space");
            this.numMoves++;
            break;
          case "ArrowUp":
            this.movementsWheel.up();
            this[this.ownRole].movementsQueue.addMovement("up");
            this.numMoves++;
            break;
          case "ArrowDown":
            this.movementsWheel.down();
            this[this.ownRole].movementsQueue.addMovement("down");
            this.numMoves++;
            break;
          case "ArrowRight":
            this.movementsWheel.right();
            this[this.ownRole].movementsQueue.addMovement("right");
            this.numMoves++;
            break;
          case "ArrowLeft":
            this.movementsWheel.left();
            this[this.ownRole].movementsQueue.addMovement("left");
            this.numMoves++;
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
    let dancerRole = state.players.find(
      (p) => p.id !== state.currentPlayer?.id
    )?.role;
    let imitated = state.players.find((p) => p.role === "imitated");
    switch (state.result.status) {
      case Statuses.WAITING:
        this.status.value = "Esperando jugadores...";
        break;
      case Statuses.PLAYING:
        this.isTurn = false;
        this.round = state.round;
        if (state.movementsToPlay.length > 0) {
          this[dancerRole].playDance(
            state.movementsToPlay,
            imitated.movements,
            () => {
              this[dancerRole].movementsQueue.clear();
              this.updateState(state);
            }
          );
        } else {
          this.updateState(state);
        }
        break;
      case Statuses.WIN:
        this.isTurn = false;
        this[dancerRole].playDance(
          state.movementsToPlay,
          imitated?.movements,
          () => {
            this[dancerRole].movementsQueue.clear();

            this.status.value =
              "Ha ganado " + state.result.winner.playerName + "! ";
            this.isTurn = false;
          }
        );
        break;
    }
  }

  updateState(state) {
    if (state.currentPlayer.id == socketId) {
      this.currentTurn = "Tu turno! ";
      this.isTurn = true;
    } else {
      let opponent = state.players.find((p) => p.id != socketId).playerName;
      this.currentTurn = "Turno de " + opponent + ": ";
    }
    this.updateRound();
  }

  updateRound() {
    switch (this.round) {
      case 3:
        this.roundIndicator.value = "Round 1";
        break;
      case 5:
        this.roundIndicator.value = "Round 2";
        break;
      case 7:
        this.roundIndicator.value = "Round 3";
        break;
    }
  }

  updateTurnTimer(secondsLeft) {
    this.status.value = this.currentTurn + secondsLeft + "s...";
  }
}
