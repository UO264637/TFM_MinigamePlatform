class LobbyLayer extends Layer {
  constructor() {
    super();
    this.listX = originalCanvasWidth * 0.1;
    this.listY = originalCanvasHeight * 0.1;
    this.playerTexts = [];
    this.readySymbols = [];
    this.background = new Background(
      images.lobby_background,
      canvas.width * 0.5,
      canvas.height * 0.5
    );
    this.readyButton = new Button(
      images.ready_button,
      200,
      originalCanvasHeight * 0.8
    );
  }

  updateGameState(state) {
    this.readySymbols = [];

    for (let player of state.players) {
      let playerText = this.playerTexts.find(
        (p) => p.value == player.playerName
      );
      if (playerText == null) {
        playerText = new Text(
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

    for (let playerText of this.playerTexts) {
      playerText.paint();
    }

    for (let symbol of this.readySymbols) {
      symbol.paint();
    }

    this.readyButton.paint();
  }

  calculateTaps(taps) {
    this.readyButton.pressed = false;

    for (const tap of taps) {
      if (this.readyButton.containsPoint(tap.x, tap.y)) {
        this.readyButton.pressed = true;
        if (tap.type == tapType.start) {
          controls.ready = true;
        }
      }
    }

    if (!this.readyButton.pressed) {
      controls.ready = false;
    }
  }

  processControls() {
    if (controls.ready) {
      socket.emit("ready");
    }
  }
}
