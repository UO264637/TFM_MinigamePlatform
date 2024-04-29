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
    this.playButton = new Button(images.play_button, 820, 500);
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

    this.playButton.paint();
    this.backButton.paint();
  }

  calculateTaps(taps) {
    this.playButton.pressed = false;

    for (const tap of taps) {
      if (this.playButton.containsPoint(tap.x, tap.y) && tap.type == tapType.start) {
        this.playButton.pressed = true;
        controls.ready = true;
        this.playButton.image.src = images.play_button_pressed;
        socket.emit("playAgain");
      }
      if (this.backButton.containsPoint(tap.x, tap.y) && tap.type == tapType.start) {
        this.backButton.pressed = true;
        window.location.href = "../index.html";
        this.backButton.image.src = images.back_button_pressed;
      }
    }

    if (!this.playButton.pressed) {
      controls.ready = false;
    }
  }

  processControls() {
    if (controls.ready) {
      socket.emit("ready");
    }
  }
}
