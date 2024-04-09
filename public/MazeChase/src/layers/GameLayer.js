class GameLayer extends Layer {
  constructor() {
    super();
    this.start();
    this.turnTimer = 0;
  }

  start() {
    this.wallTiles = [];
    this.space = new Space(0);

    this.background = new Background(
      images.background,
      canvas.width * 0.5,
      canvas.height * 0.5
    );
    this.player1 = new Text(
      0,
      "#563F2E",
      originalCanvasWidth * 0.01,
      originalCanvasHeight * 0.47
    );
    this.player2 = new Text(
      0,
      "#563F2E",
      originalCanvasWidth * 0.01,
      originalCanvasHeight * 0.53
    );
    this.status = new Text(
      0,
      "#563F2E",
      originalCanvasWidth * 0.01,
      originalCanvasHeight * 0.1
    );
    this.status.value = "";
    this.loadMap("/maph.txt");
  }

  update() {
    this.space.update();
    this.player.update();
    this.opponent.update();
  }

  paint() {
    this.background.paint();

    for (let tile of this.wallTiles) {
      tile.paint();
    }

    this.player1.paint();
    this.player2.paint();
    this.status.paint();
    this.player.paint();
    this.opponent.paint();
  }

  initialize(state) {
    let pursued = state.players.find((p) => p.role == "pursued");
    let haunter = state.players.find((p) => p.role == "haunter");

    if (haunter.id == socketId) {
      //this.player = this.haunter;
    } else {
      let aux = this.player;
      this.player = this.opponent;
      this.opponent = aux;
      console.log(this.player);
      console.log(this.opponent);
    }
  }

  processControls() {
    let nextDirection = 0;
    // Eje X
    if (controls.moveX > 0) {
      nextDirection = "X";
    } else if (controls.moveX < 0) {
      nextDirection = "-X";
    }
    // Eje Y
    if (controls.moveY > 0) {
      nextDirection = "-Y";
    } else if (controls.moveY < 0) {
      nextDirection = "Y";
    }

    if (nextDirection != 0) {
      this.player.addDirection(nextDirection);
      socket.emit("action", {
        nextDirection: nextDirection,
      });
    }
  }

  updateGameState(state) {
    switch (state.result.status) {
      case Statuses.WAITING:
        this.status.value = "Esperando jugadores...";
        break;
      case Statuses.PLAYING: {
        let opponentState = state.players.find((p) => p.id != socketId);
        console.log(this.opponent);
        this.opponent.addDirection(opponentState.nextDirection);
        break;
      }
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
        state.players[0].role + ": " + state.players[0].playerName;
    }

    if (state.players.length > 1) {
      this.player2.value =
        state.players[1].role + ": " + state.players[1].playerName;
    }
  }

  updateTurnTimer(secondsLeft) {
    this.status.value = secondsLeft + "s...";
  }

  loadMap(route) {
    fetch(baseUrl + route)
      .then((response) => response.text())
      .then((file) => {
        let lines = file.split("\n");
        let mapWidth = lines[0].length; // Ancho del mapa (número de columnas)
        let mapOffsetX = (originalCanvasWidth - mapWidth * 24) / 2; // Offset horizontal para centrar el mapa

        for (let i = 0; i < lines.length; i++) {
          let line = lines[i];
          for (let j = 0; j < mapWidth; j++) {
            let symbol = line[j];
            let x = mapOffsetX + 24 + j * 24; // Calcula la posición x ajustada para centrar el mapa
            let y = 24 + i * 24; // Calcula la posición y ajustada para centrar el mapa
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
      case "S": {
        this.player = new Player(x, y);
        // modificación para empezar a contar desde el suelo
        this.player.y = this.player.y - this.player.height / 2;
        this.space.addDinamicCorp(this.player);
        break;
      }
      case "s": {
        this.opponent = new Player(x, y);
        this.opponent.y = this.opponent.y - this.opponent.height / 2;
        this.space.addDinamicCorp(this.opponent);
        break;
      }
      case "■": {
        let wallTile = new Wall(images.c_tile, x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        this.wallTiles.push(wallTile);
        this.space.addStaticCorp(wallTile);
        break;
      }
      case "┌": {
        let wallTile = new Wall(images.itl_tile, x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        this.wallTiles.push(wallTile);
        this.space.addStaticCorp(wallTile);
        break;
      }
      case "┐": {
        let wallTile = new Wall(images.itr_tile, x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        this.wallTiles.push(wallTile);
        this.space.addStaticCorp(wallTile);
        break;
      }
      case "┘": {
        let wallTile = new Wall(images.ibr_tile, x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        this.wallTiles.push(wallTile);
        this.space.addStaticCorp(wallTile);
        break;
      }
      case "└": {
        let wallTile = new Wall(images.ibl_tile, x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        this.wallTiles.push(wallTile);
        this.space.addStaticCorp(wallTile);
        break;
      }
      case "─": {
        let wallTile = new Wall(images.t_tile, x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        this.wallTiles.push(wallTile);
        this.space.addStaticCorp(wallTile);
        break;
      }
      case "┤": {
        let wallTile = new Wall(images.r_tile, x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        this.wallTiles.push(wallTile);
        this.space.addStaticCorp(wallTile);
        break;
      }
      case "═": {
        let wallTile = new Wall(images.b_tile, x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        this.wallTiles.push(wallTile);
        this.space.addStaticCorp(wallTile);
        break;
      }
      case "├": {
        let wallTile = new Wall(images.l_tile, x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        this.wallTiles.push(wallTile);
        this.space.addStaticCorp(wallTile);
        break;
      }
      case "╔": {
        let wallTile = new Wall(images.tl_tile, x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        this.wallTiles.push(wallTile);
        this.space.addStaticCorp(wallTile);
        break;
      }
      case "╗": {
        let wallTile = new Wall(images.tr_tile, x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        this.wallTiles.push(wallTile);
        this.space.addStaticCorp(wallTile);
        break;
      }
      case "╝": {
        let wallTile = new Wall(images.br_tile, x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        this.wallTiles.push(wallTile);
        this.space.addStaticCorp(wallTile);
        break;
      }
      case "╚": {
        let wallTile = new Wall(images.bl_tile, x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        this.wallTiles.push(wallTile);
        this.space.addStaticCorp(wallTile);
        break;
      }
    }
  }
}
