class HUDLayer extends Layer {
  STEP = 19;
  START = 85;

  constructor() {
    super();
    this.start();
  }

  start() {
    this.progressBar = new Background(images.progressbar, 315, originalCanvasHeight - 65);
    this.flag = new Background(images.flag, 600, originalCanvasHeight - 65);
    this.player1 = new Background(images.progress_indicator1, this.START, originalCanvasHeight - 65);
    this.player2 = new Background(images.progress_indicator2, this.START, originalCanvasHeight - 65);
    this.player1name = new CenteredText("Tú", "#FFFFFF", this.START, originalCanvasHeight - 20);
    this.player2name = new CenteredText("", "#FFFFFF", this.START, originalCanvasHeight - 20);
  }

  paint() {
    this.progressBar.paint();
    this.flag.paint();

    this.player2.paint();
    this.player1.paint();
    this.player2name.paint();
    this.player1name.paint();
  }

  updatePlayerPositions(state) {
    let you = state.players.find((p) => p.id == socketId);
    let opponent = state.players.find((p) => p.id != socketId);


    this.player1.x = this.START + you.position * this.STEP;
    this.player2.x = this.START + opponent.position * this.STEP;
    this.player1name.x = this.START + you.position * this.STEP;
    this.player2name.x = this.START + opponent.position * this.STEP;

    if (this.player1name.collides(this.player2name)) {
      this.player1name.value = "";
      this.player2name.value = "";
      if (this.player1name.x < this.player2name.x) {
        this.player1name.value = "Tú, " + opponent.playerName;
      }
      else {
        this.player2name.value = opponent.playerName + ", Tú";
      }
    } else {
      this.player1name.value = "Tú";
      this.player2name.value = opponent.playerName;
    }
  }

}
