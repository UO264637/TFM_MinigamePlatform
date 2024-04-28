class GameLayer extends Layer {
  constructor() {
    super();
    this.results = new ResultsLayer();
    this.initialize();
  }

  initialize() {
    this.countdown = new Countdown();
    this.wallTiles = [];
    this.space = new Space(0);
    this.player = new Player(-50, 0, "p1");
    this.opponent = new Player(-50, 50, "p2");
    this.turnTimer = 0;

    this.background1 = new Background(
      images.background1,
      canvas.width * 0.5,
      canvas.height * 0.5
    );
    this.background2 = new Background(
      images.background2,
      canvas.width * 0.5,
      canvas.height * 0.5
    );
    this.background3 = new Background(
      images.background3,
      canvas.width * 0.5,
      canvas.height * 0.5
    );

    this.background = this.background1;

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
  }

  update() {
    this.space.update();
    this.player.update();
    this.opponent.update();

    if (!this.player.pursued && this.player.collides(this.opponent)) {
      socket.emit("action", { haunted: true });
    }
    this.countdown.update();
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
    this.countdown.paint();

    if (this.player.frozen) {
      this.iceEffect.paint();
    }

    if (this.finished) {
      this.results.paint();
    }
  }

  processControls() {
    if (this.finished) {
      this.results.processControls();
    }

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

  calculateTaps(taps) {
    if (this.finished) {
      this.results.calculateTaps(taps);
    }
  }

  start(state) {
    disableKeyboardInput();

    let pursued = state.players.find((p) => p.role == "pursued");
    let haunter = state.players.find((p) => p.role == "haunter");

    if (haunter.id == socketId) {
      this.opponent.switchRole();
      this.opponent.tag.value = pursued.playerName;
      this.skillButton.switchSkill(images.ice_skill);
    } else {
      let aux = this.player;
      this.player = this.opponent;
      this.player.switchRole();
      this.opponent = aux;
      this.opponent.tag.value = haunter.playerName;
    }
    this.player.tag.value = "Tú";

    this.loadMap(state.map);
    this.countdown.start();
    setTimeout(() => {
      this.player.startMoving();
      this.opponent.startMoving();
    }, 3000);
  }

  updateGameState(state) {
    if (state.result.status == Statuses.PLAYING) {
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
    }
  }

  finish(state) {
    disableKeyboardInput();
    this.player.stop();
    this.opponent.stop();
    this.isTurn = false;
    this.finished = true;
    this.results.updateGameState(state);
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
      this.opponent.makeInvulnerable();
      this.skillButton.switchSkill(images.speed_skill);
    }
  }

  updateTurnTimer(secondsLeft) {
    this.status.value = secondsLeft + "s...";
  }

  loadMap(map) {
    this.background = this["background" + map];

    fetch(baseUrl + "/map" + map + "h.txt")
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
            this.loadMapObject(map, symbol, x, y);
          }
        }
      })
      .catch((error) => {
        console.error("Error al obtener el archivo:", error);
      });
  }

  loadMapObject(map, symbol, x, y) {
    switch (symbol) {
      case "S": {
        // modificación para empezar a contar desde el suelo
        if (this.player.pursued) {
          this.opponent.x = x;
          this.opponent.y = y - this.opponent.height / 2;
        } else {
          this.player.x = x;
          this.player.y = y - this.player.height / 2;
        }
        this.space.addDinamicCorp(this.player);
        break;
      }
      case "s": {
        if (this.player.pursued) {
          this.player.x = x;
          this.player.y = y - this.player.height / 2;
        } else {
          this.opponent.x = x;
          this.opponent.y = y - this.opponent.height / 2;
        }
        this.space.addDinamicCorp(this.opponent);
        break;
      }
      case "■": {
        let wallTile = new Wall(images["c_tile" + map], x, y);
        if (Math.random() > 0.95) {
          wallTile = new Wall(images["c_tile" + map + "b"], x, y);
        }
        wallTile.y = wallTile.y - wallTile.height / 2;
        this.wallTiles.push(wallTile);
        this.space.addStaticCorp(wallTile);
        break;
      }
      case "┌": {
        let wallTile = new Wall(images["itl_tile" + map], x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        this.wallTiles.push(wallTile);
        this.space.addStaticCorp(wallTile);
        break;
      }
      case "┐": {
        let wallTile = new Wall(images["itr_tile" + map], x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        this.wallTiles.push(wallTile);
        this.space.addStaticCorp(wallTile);
        break;
      }
      case "┘": {
        let wallTile = new Wall(images["ibr_tile" + map], x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        this.wallTiles.push(wallTile);
        this.space.addStaticCorp(wallTile);
        break;
      }
      case "└": {
        let wallTile = new Wall(images["ibl_tile" + map], x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        this.wallTiles.push(wallTile);
        this.space.addStaticCorp(wallTile);
        break;
      }
      case "─": {
        let wallTile = new Wall(images["t_tile" + map], x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        this.wallTiles.push(wallTile);
        this.space.addStaticCorp(wallTile);
        break;
      }
      case "┤": {
        let wallTile = new Wall(images["r_tile" + map], x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        this.wallTiles.push(wallTile);
        this.space.addStaticCorp(wallTile);
        break;
      }
      case "═": {
        let wallTile = new Wall(images["b_tile" + map], x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        this.wallTiles.push(wallTile);
        this.space.addStaticCorp(wallTile);
        break;
      }
      case "├": {
        let wallTile = new Wall(images["l_tile" + map], x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        this.wallTiles.push(wallTile);
        this.space.addStaticCorp(wallTile);
        break;
      }
      case "╔": {
        let wallTile = new Wall(images["tl_tile" + map], x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        this.wallTiles.push(wallTile);
        this.space.addStaticCorp(wallTile);
        break;
      }
      case "╗": {
        let wallTile = new Wall(images["tr_tile" + map], x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        this.wallTiles.push(wallTile);
        this.space.addStaticCorp(wallTile);
        break;
      }
      case "╝": {
        let wallTile = new Wall(images["br_tile" + map], x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        this.wallTiles.push(wallTile);
        this.space.addStaticCorp(wallTile);
        break;
      }
      case "╚": {
        let wallTile = new Wall(images["bl_tile" + map], x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        this.wallTiles.push(wallTile);
        this.space.addStaticCorp(wallTile);
        break;
      }
    }
  }
}
