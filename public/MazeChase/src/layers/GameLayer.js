class GameLayer extends Layer {
  constructor() {
    super();
    this.start();
    this.turnTimer = 0;
  }

  start() {
    disableKeyboardInput();
    this.wallTiles = [];
    this.space = new Space(0);
    this.player = new Player(-50, 0, "p1");
    this.opponent = new Player(-50, 50, "p2");

    this.coundown = new Countdown();

    this.background = new Background(
      images.background2,
      canvas.width * 0.5,
      canvas.height * 0.5
    );
    this.iceEffect = new Background(
      images.ice_effect,
      canvas.width * 0.5,
      canvas.height * 0.5
    );
    this.status = new Text(
      0,
      "#563F2E",
      originalCanvasWidth * 0.01,
      originalCanvasHeight * 0.1
    );
    this.skillButton = new SkillButton(
      images.speed_skill,
      originalCanvasWidth * 0.95,
      originalCanvasHeight * 0.9
    );
    this.status.value = "";
    this.loadMap("/map2h.txt");
  }

  update() {
    this.space.update();
    this.player.update();
    this.opponent.update();

    if (!this.player.pursued && this.player.collides(this.opponent)) {
      socket.emit("action", { haunted: true });
    }
    this.coundown.update();
  }

  paint() {
    this.background.paint();

    for (let tile of this.wallTiles) {
      tile.paint();
    }
    this.status.paint();
    this.skillButton.paint();
    this.player.paint();
    this.opponent.paint();
    this.coundown.paint();

    if (this.player.frozen) {
      this.iceEffect.paint();
    }
  }

  initialize(state) {
    let pursued = state.players.find((p) => p.role == "pursued");
    let haunter = state.players.find((p) => p.role == "haunter");

    if (haunter.id == socketId) {
      this.player.addDirection("X");
      this.player.role = "haunter";
      this.player.tag.value = "Tú";

      this.opponent.addDirection("-X");
      this.opponent.switchRole();
      this.opponent.tag.value = pursued.playerName;
      this.skillButton.switchSkill(images.ice_skill);
    } else {
      let aux = this.player;
      this.player = this.opponent;
      this.player.addDirection("-X");
      this.player.tag.value = "Tú";
      this.player.pursued = true;

      this.opponent = aux;
      this.opponent.addDirection("X");
      this.opponent.tag.value = haunter.playerName;
    }

    enableKeyboardInput();
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
        x: this.player.x,
        y: this.player.y,
      });
    }

    if (controls.action && this.skillButton.isReseted()) {
      controls.action = false;
      this.skillButton.startCooldown();
      this.player.useSkill(this.opponent);
      socket.emit("action", {
        skill: true,
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

        if (opponentState.nextDirection != null) {
          this.opponent.addDirection(opponentState.nextDirection);
          this.checkOpponentPosition(opponentState.x, opponentState.y);
        }

        if (opponentState.skill) {
          this.useSkill();
        }
        if (state.invert) {
          this.invertRoles();
        }
        break;
      }
      case Statuses.WIN:
        disableKeyboardInput();
        this.player.stop();
        this.opponent.stop();
        this.status.value =
          "Ha ganado " + state.result.winner.playerName + "! ";
        this.isTurn = false;
        break;
      default:
        break;
    }
  }

  checkOpponentPosition(x, y) {
    const diffX = this.opponent.x - x;
    const diffY = this.opponent.y - y;

    // Calcular la distancia euclidiana
    const distance = Math.sqrt(diffX * diffX + diffY * diffY);

    if (distance > 10) {
      this.opponent.x = x;
      this.opponent.y = y;
    }
  }

  useSkill() {
    if (this.player.pursued) {
      this.player.freeze();
    } else {
      this.opponent.speedUp();
    }
  }

  invertRoles() {
    this.player.switchRole();
    this.opponent.switchRole();

    if (!this.player.pursued) {
      this.player.haunt();
      this.skillButton.switchSkill(images.ice_skill);
    } else {
      this.opponent.stop();
      this.skillButton.switchSkill(images.speed_skill);
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
        // modificación para empezar a contar desde el suelo
        this.player = new Player(x, y - this.player.height / 2, "p1");
        this.space.addDinamicCorp(this.player);
        break;
      }
      case "s": {
        this.opponent = new Player(x, y - this.opponent.height / 2, "p2");
        this.space.addDinamicCorp(this.opponent);
        break;
      }
      case "■": {
        let wallTile = new Wall(images["c_tile" + "2"], x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        this.wallTiles.push(wallTile);
        this.space.addStaticCorp(wallTile);
        break;
      }
      case "┌": {
        let wallTile = new Wall(images["itl_tile" + "2"], x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        this.wallTiles.push(wallTile);
        this.space.addStaticCorp(wallTile);
        break;
      }
      case "┐": {
        let wallTile = new Wall(images["itr_tile" + "2"], x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        this.wallTiles.push(wallTile);
        this.space.addStaticCorp(wallTile);
        break;
      }
      case "┘": {
        let wallTile = new Wall(images["ibr_tile" + "2"], x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        this.wallTiles.push(wallTile);
        this.space.addStaticCorp(wallTile);
        break;
      }
      case "└": {
        let wallTile = new Wall(images["ibl_tile" + "2"], x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        this.wallTiles.push(wallTile);
        this.space.addStaticCorp(wallTile);
        break;
      }
      case "─": {
        let wallTile = new Wall(images["t_tile" + "2"], x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        this.wallTiles.push(wallTile);
        this.space.addStaticCorp(wallTile);
        break;
      }
      case "┤": {
        let wallTile = new Wall(images["r_tile" + "2"], x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        this.wallTiles.push(wallTile);
        this.space.addStaticCorp(wallTile);
        break;
      }
      case "═": {
        let wallTile = new Wall(images["b_tile" + "2"], x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        this.wallTiles.push(wallTile);
        this.space.addStaticCorp(wallTile);
        break;
      }
      case "├": {
        let wallTile = new Wall(images["l_tile" + "2"], x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        this.wallTiles.push(wallTile);
        this.space.addStaticCorp(wallTile);
        break;
      }
      case "╔": {
        let wallTile = new Wall(images["tl_tile" + "2"], x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        this.wallTiles.push(wallTile);
        this.space.addStaticCorp(wallTile);
        break;
      }
      case "╗": {
        let wallTile = new Wall(images["tr_tile" + "2"], x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        this.wallTiles.push(wallTile);
        this.space.addStaticCorp(wallTile);
        break;
      }
      case "╝": {
        let wallTile = new Wall(images["br_tile" + "2"], x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        this.wallTiles.push(wallTile);
        this.space.addStaticCorp(wallTile);
        break;
      }
      case "╚": {
        let wallTile = new Wall(images["bl_tile" + "2"], x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        this.wallTiles.push(wallTile);
        this.space.addStaticCorp(wallTile);
        break;
      }
    }
  }
}
