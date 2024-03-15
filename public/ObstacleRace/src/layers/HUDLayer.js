class HUDLayer extends Layer {
  STEP = 20; 

  constructor() {
    super();
    //this.step =30;
    this.start();
  }

  start() {
    this.progressBar = new Background(images.progressbar, 315, originalCanvasHeight - 65);
    this.flag = new Background(images.flag, 600, originalCanvasHeight - 65);
    this.player1 = new Background(images.progress_indicator, 90, originalCanvasHeight - 65);
    this.player2 = new Background(images.progress_indicator, 90, originalCanvasHeight - 65);
  }

  // En cada iteración fp del juego
  update() {

  }

  paint() {
    this.progressBar.paint();
    this.flag.paint();
    this.player1.paint();
    this.player2.paint();
  }

  updateGameState(state) {
    this.status.value = "";
    switch (state.result.status) {
      case Statuses.WAITING:
        //this.status.value = "Esperando jugadores...";
        break;
      case Statuses.PLAYING:
        break;
      case Statuses.DRAW:
        // this.speed = 0;
        //this.status.value = "Empate!";
        break;
      case Statuses.WIN:
        //this.speed = 0;
        //this.status.value = "Ha ganado " + state.result.winner.playerName + "!";
        break;
      default:
        break;
    }
  }

}
