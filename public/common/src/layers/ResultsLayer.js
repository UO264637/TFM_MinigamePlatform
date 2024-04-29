class ResultsLayer extends Layer {
  constructor() {
    super();
    this.listX = 500;
    this.symbolX = 790;
    this.playerTexts = [];
    this.readySymbols = [];
    this.background = new Background(
      images.results_background,
      canvas.width * 0.5,
      canvas.height * 0.5
    );
    this.rematchButton = new Button(images.play_button, 820, 500);
    this.backButton = new Button(images.back_button, 460, 500);
    this.result = new CenteredText("", "#563F2E", 650, 225, 40);
  }

  updateGameState(state) {
    if (state.result.status == Statuses.DRAW) {
      this.result.value = "Empate!";
    } else if (state.result.status == Statuses.WIN) {
      this.result.value = "Ha ganado " + state.result.winner.playerName + "! ";
    }

    this.listY = 340;
    this.readySymbols = [];
    this.playerTexts = [];

    for (let player of state.players) {
      let playerText = new Text(
        player.playerName,
        "#563F2E",
        this.listX,
        this.listY,
        24
      );
      this.playerTexts.push(playerText);

      if (player.ready) {
        let symbol = new Background(
          images.ready_symbol,
          this.symbolX,
          this.listY - 11
        );
        this.readySymbols.push(symbol);
      } else {
        let symbol = new Background(
          images.waiting_symbol,
          this.symbolX,
          this.listY - 11
        );
        this.readySymbols.push(symbol);
      }
      this.listY += 55;
    }
  }

  paint() {
    this.background.paint();
    this.result.paint();

    for (let playerText of this.playerTexts) {
      playerText.paint();
    }

    for (let symbol of this.readySymbols) {
      symbol.paint();
    }

    this.rematchButton.paint();
    this.backButton.paint();
  }

  calculateTaps(taps) {
    this.rematchButton.pressed = false;

    for (const tap of taps) {
      if (this.rematchButton.containsPoint(tap.x, tap.y)) {
        this.rematchButton.pressed = true;
        if (tap.type == tapType.start) {
          socket.emit("playAgain");
        }
      }
      if (this.backButton.containsPoint(tap.x, tap.y)) {
        this.backButton.pressed = true;
        if (tap.type == tapType.start) {
          window.location.href = "../index.html";
        }
      }
    }

    if (!this.rematchButton.pressed) {
      controls.ready = false;
    }
  }

  processControls() {
    if (controls.ready) {
      socket.emit("ready");
    }
  }
}
