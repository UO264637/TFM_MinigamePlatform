class GameLayer extends Layer {
  constructor() {
    super();
    this.start();
    this.turnTimer = 0;
  }

  start() {
    this.board = [];
    this.wallTiles = [];

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        this.board[i + j + i * 2] = new Button(
          images.tttButton,
          canvas.width / 2 - 155 + i * 155,
          canvas.height / 2 - 155 + j * 155
        );
      }
    }

    this.background = new Background(
      images.background,
      canvas.width * 0.5,
      canvas.height * 0.5
    );
    this.turnIndicator = new Background(
      images.turnIndicator,
      canvas.width * 0.5,
      canvas.height * 0.5
    );
    this.player1 = new Text(
      0,
      "#563F2E",
      canvas.width * 0.07,
      canvas.height * 0.47
    );
    this.player2 = new Text(
      0,
      "#563F2E",
      canvas.width * 0.07,
      canvas.height * 0.53
    );
    this.status = new CenteredText(
      0,
      "#563F2E",
      canvas.width * 0.5,
      canvas.height * 0.1
    );
    this.status.value = "";
    this.loadMap("/maph.txt");
  }

  paint() {
    this.background.paint();

    for (let i = 0; i < 9; i++) {
      this.board[i].paint();
    }

    this.player1.paint();
    this.player2.paint();
    this.status.paint();

    if (this.isTurn) {
      this.turnIndicator.paint();
    }

    for (let tile of this.wallTiles) {
      tile.paint();
    }
  }

  updateGameState(state) {
    for (let i = 0; i < state.board.length; i++) {
      const player = state.board[i];
      if (player != null) {
        this.board[i].image.src = images[player.symbol];
      }
    }

    switch (state.result.status) {
      case Statuses.WAITING:
        this.status.value = "Esperando jugadores...";
        break;
      case Statuses.PLAYING:
        if (state.currentPlayer.id == socketId) {
          this.currentTurn = "Tu turno! ";
          this.isTurn = true;
        } else {
          let opponent = state.players.find((p) => p.id != socketId).playerName;
          this.currentTurn = "Turno de " + opponent + ": ";
          this.isTurn = false;
        }
        break;
      case Statuses.DRAW:
        this.status.value = "Empate!";
        this.isTurn = false;
        break;
      case Statuses.WIN:
        this.status.value =
          "Ha ganado " + state.result.winner.playerName + "! ";
        this.isTurn = false;
        break;
      default:
        break;
    }

    this.player1.value = "";
    this.player2.value = "";
    if (state.players.length > 0) {
      this.player1.value =
        state.players[0].symbol + ": " + state.players[0].playerName;
    }

    if (state.players.length > 1) {
      this.player2.value =
        state.players[1].symbol + ": " + state.players[1].playerName;
    }
  }

  updateTurnTimer(secondsLeft) {
    this.status.value = this.currentTurn + secondsLeft + "s...";
  }

  loadMap(route) {
    fetch(baseUrl + route)
      .then((response) => response.text())
      .then((file) => {
        let lines = file.split("\n");
        let mapWidth = lines[0].length; // Ancho del mapa (número de columnas)
        let mapOffsetX = (originalCanvasWidth - mapWidth * 20) / 2; // Offset horizontal para centrar el mapa

        for (let i = 0; i < lines.length; i++) {
          let line = lines[i];
          for (let j = 0; j < mapWidth; j++) {
            let symbol = line[j];
            let x = mapOffsetX+20 + j * 20; // Calcula la posición x ajustada para centrar el mapa
            let y = 20 + i * 20; // Calcula la posición y ajustada para centrar el mapa
            this.loadMapObject(symbol, x, y);
          }
        }
      })
      .catch((error) => {
        console.error("Error al obtener el archivo:", error);
      });
  }

  loadMapObject(symbol, x, y) {
    switch (symbol) {
      case "1":
        this.jugador = new Jugador(x, y);
        // modificación para empezar a contar desde el suelo
        this.jugador.y = this.jugador.y - this.jugador.alto / 2;
        break;
      case "■": {
        let wallTile = new Wall(images.c_tile, x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        this.wallTiles.push(wallTile);
        break;
      }
      case "┌": {
        let wallTile = new Wall(images.itl_tile, x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        this.wallTiles.push(wallTile);
        break;
      }
      case "┐": {
        let wallTile = new Wall(images.itr_tile, x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        this.wallTiles.push(wallTile);
        break;
      }
      case "┘": {
        let wallTile = new Wall(images.ibr_tile, x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        this.wallTiles.push(wallTile);
        break;
      }
      case "└": {
        let wallTile = new Wall(images.ibl_tile, x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        this.wallTiles.push(wallTile);
        break;
      }
      case "─": {
        let wallTile = new Wall(images.t_tile, x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        this.wallTiles.push(wallTile);
        break;
      }
      case "┤": {
        let wallTile = new Wall(images.r_tile, x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        this.wallTiles.push(wallTile);
        break;
      }
      case "═": {
        let wallTile = new Wall(images.b_tile, x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        this.wallTiles.push(wallTile);
        break;
      }
      case "├": {
        let wallTile = new Wall(images.l_tile, x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        this.wallTiles.push(wallTile);
        break;
      }
      case "╔": {
        let wallTile = new Wall(images.tl_tile, x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        this.wallTiles.push(wallTile);
        break;
      }
      case "╗": {
        let wallTile = new Wall(images.tr_tile, x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        this.wallTiles.push(wallTile);
        break;
      }
      case "╝": {
        let wallTile = new Wall(images.br_tile, x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        this.wallTiles.push(wallTile);
        break;
      }
      case "╚": {
        let wallTile = new Wall(images.bl_tile, x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        this.wallTiles.push(wallTile);
        break;
      }
    }
  }
}
