class LobbyLayer extends Layer {
  constructor() {
    super();
    this.listX = 895;
    this.symbolX = 1185;
    this.playerTexts = [];
    this.readySymbols = [];
    this.background = new Background(
      images.lobby_background,
      canvas.width * 0.5,
      canvas.height * 0.5
    );
    this.screenshot = new Background(
      images.screenshot,
      450,
      275
    );
    this.controls = new Background(
      images.controls,
      1050,
      250
    );
    this.explanation = new Background(
      images.explanation,
      450,
      595
    );
    this.readyButton = new Button(
      images.ready_button,
      1050,
      632.5
    );
    this.players = new CenteredText(
      "Jugadores (0/X)",
      "#563F2E",
      1050,
      437,
      28
    );
  }

  updateGameState(state) {
    this.listY = 495;
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

    this.players.value = "Jugadores (" + state.players.length + "/" + state.maxPlayers + ")";
  }

  paint() {
    this.background.paint();
    this.screenshot.paint();
    this.controls.paint();
    this.explanation.paint();
    this.players.paint();
    this.readyButton.paint();

    for (let playerText of this.playerTexts) {
      playerText.paint();
    }

    for (let symbol of this.readySymbols) {
      symbol.paint();
    }
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
