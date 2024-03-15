class HUDLayer extends Layer {
  STEP = 19; 
  START = 85;

  constructor() {
    super();
    //this.step =30;
    this.start();
  }

  start() {
    this.progressBar = new Background(images.progressbar, 315, originalCanvasHeight - 65);
    this.flag = new Background(images.flag, 600, originalCanvasHeight - 65);
    this.player1 = new Background(images.progress_indicator, this.START, originalCanvasHeight - 65);
    this.player2 = new Background(images.progress_indicator, this.START, originalCanvasHeight - 65);
  }

  paint() {
    this.progressBar.paint();
    this.flag.paint();
    this.player1.paint();
    this.player2.paint();
  }

  updatePlayerPositions(state) {
    this.player1.x = this.START + state.players[0].position * this.STEP;
    this.player2.x = this.START + state.players[1].position * this.STEP;
  }

}
