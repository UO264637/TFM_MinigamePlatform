class GameLayer extends Layer {
  constructor() {
    super();
    this.initialize();
  }

  initialize() {
    this.countdown = new Countdown();
    this.players = [];
    this.round = 3;
    this.isTurn = false;
    this.numMoves = 0;
    this.turnTimer = 0;

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
    this.countdown.update();
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
    this.countdown.paint();
  }

  processControls() {
    if (this.isTurn) {
      const wheelFunctions = {
        Space: () => this.movementsWheel.middle(),
        ArrowUp: () => this.movementsWheel.up(),
        ArrowDown: () => this.movementsWheel.down(),
        ArrowRight: () => this.movementsWheel.right(),
        ArrowLeft: () => this.movementsWheel.left(),
      };

      for (let key of pressedKeys) {
        if (wheelFunctions[key]) {
          wheelFunctions[key]();
          let formattedKey = key.replace("Arrow", "").toLowerCase();
          this[this.ownRole].movementsQueue.addMovement(formattedKey);
          this.numMoves++;
        }
      }

      pressedKeys.splice(0, pressedKeys.length);
    } else {
      pressedKeys.length = 0;
    }
  }

  start(state) {
    disableKeyboardInput();
    this.round = state.round;

    let player = state.players.find((p) => p.id == socketId);
    let opponent = state.players.find((p) => p.id != socketId);
    this.ownRole = player.role;

    this[player.role] = this.backPlayer;
    this[player.role].setName(player.playerName);
    this[opponent.role] = this.frontPlayer;
    this[opponent.role].setName(opponent.playerName);

    this.countdown.start();
    setTimeout(() => {
      playMusic();
    }, 3000);
  }

  updateGameState(state) {
    let dancerRole = state.players.find(
      (p) => p.id !== state.currentPlayer?.id
    ).role;
    let imitated = state.players.find((p) => p.role === "imitated");
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
  }

  finish(state) {
    stopMusic();
    for (let player of this.players) {
      player.movementsQueue.clear();
    }

    this.countdown = new Countdown();
    this.round = 3;
    this.isTurn = false;
    this.numMoves = 0;
    this.turnTimer = 0;
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
    for (let player of this.players) {
      player.movementsQueue.movementsPlaceholder.setRound(this.round);
    }
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
