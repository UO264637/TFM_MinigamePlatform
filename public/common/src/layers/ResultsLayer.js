class ResultsLayer extends Layer {
  constructor() {
    super();
    this.listX = originalCanvasWidth * 0.5;
    this.listY = originalCanvasHeight * 0.4;
    this.playerTexts = [];
    this.readySymbols = [];
    this.background = new Background(
      images.lobby_background,
      canvas.width * 0.5,
      canvas.height * 0.5
    );
    this.rematchButton = new Button(
      images.ready_button,
      originalCanvasWidth * 0.6,
      originalCanvasHeight * 0.8
    );
    this.backButton = new Button(
      images.ready_button,
      originalCanvasWidth * 0.4,
      originalCanvasHeight * 0.8
    );
    this.result = new CenteredText(
      "",
      "#563F2E",
      canvas.width * 0.5,
      canvas.height * 0.2,
      40
    );
  }

  updateGameState(state) {
    if (state.result.status == Statuses.DRAW) {
      this.result.value = "Empate!";
    }
    else if (state.result.status == Statuses.WIN) {
      this.result.value =
      "Ha ganado " + state.result.winner.playerName + "! ";
    }

    this.readySymbols = [];

    for (let player of state.players) {
      let playerText = this.playerTexts.find(
        (p) => p.value == player.playerName
      );
      if (playerText == null) {
        playerText = new CenteredText(
          player.playerName,
          "#563F2E",
          this.listX,
          this.listY,
          24
        );

        this.playerTexts.push(playerText);
        this.listY += 24;
      }

      playerText.paint();

      if (player.ready) {
        let symbol = new Text(
          "✔",
          "#C5DBC4",
          this.listX + playerText.width,
          playerText.y,
          24
        );
        this.readySymbols.push(symbol);
      } else {
        let symbol = new Text(
          "✘",
          "#FFADAD",
          this.listX + playerText.width,
          playerText.y,
          24
        );
        this.readySymbols.push(symbol);
      }
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
          //controls.ready = true;
          console.log("A")
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
