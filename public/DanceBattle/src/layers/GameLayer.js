class GameLayer extends Layer {
  constructor() {
    super();
    this.start();
    this.turnTimer = 0;
  }

  start() {
    this.players = [];
    this.round = 3;
    this.isTurn = false;
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

    this.movementsWheel = new MovementsWheel(
      originalCanvasWidth * 0.45,
      originalCanvasHeight * 0.475
    );

    this.movementsQueue = new MovementsQueue("back");
  }

  update() {
    this.movementsWheel.update();

    for (let player of this.players) {
      player.update();
    }

    if (this.moves.length >= this.round) {
      socket.emit("action", { movements: this[this.ownRole].movementsQueue});
      this.moves = [];
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
    this.movementsQueue.paint();
  }

  initialize(state) {
    this.round = state.round;

    let player = state.players.find((p) => p.id == socketId);
    let opponent = state.players.find((p) => p.id != socketId);
    this.ownRole = player.role;

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
            this.movementsWheel.middle();
            this.moves.push("space");
            this[this.ownRole].movementsQueue.addMovement("space");
            break;
          case "ArrowUp":
            this.movementsWheel.up();
            this.moves.push("up");
            this[this.ownRole].movementsQueue.addMovement("up");
            break;
          case "ArrowDown":
            this.movementsWheel.down();
            this.moves.push("down");
            this[this.ownRole].movementsQueue.addMovement("down");
            break;
          case "ArrowRight":
            this.movementsWheel.right();
            this.moves.push("right");
            this[this.ownRole].movementsQueue.addMovement("right");
            break;
          case "ArrowLeft":
            this.movementsWheel.left();
            this.moves.push("left");
            this[this.ownRole].movementsQueue.addMovement("left");
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
    let dancerRole = state.players?.find(p => p.id !== state.currentPlayer.id)?.role;
    switch (state.result.status) {
      case Statuses.WAITING:
        this.status.value = "Esperando jugadores...";
        break;
      case Statuses.PLAYING:
        this.isTurn = false;
        this.round = state.round;
        if (state.movementsToPlay.length > 0) {
          //this.playDance(state);

          this[dancerRole].playDance(state.movementsToPlay, () => {
            this[dancerRole].movementsQueue.clear();
            this.movementsQueue.clear();

            this.updateState(state);
          });
        } else {
          this.updateState(state);
        }
        break;
      case Statuses.WIN:
        this[dancerRole].playDance(state.movementsToPlay, () => {
          this[dancerRole].movementsQueue.clear();
          this.movementsQueue.clear();

          this.status.value =
            "Ha ganado " + state.result.winner.playerName + "! ";
          this.isTurn = false;
        });

        break;
      default:
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
  }

  updateTurnTimer(secondsLeft) {
    this.status.value = this.currentTurn + secondsLeft + "s...";
  }
}
