class MapGenerator {
  loadMap(fileRoute) {
    fetch(baseUrl + fileRoute)
      .then((response) => response.text())
      .then((file) => {
        let lines = file.split("\n");
        let mapWidth = lines[0].length; // Ancho del mapa (número de columnas)
        let mapOffsetX = (originalCanvasWidth - mapWidth * 20) / 2; // Offset horizontal para centrar el mapa

        for (let i = 0; i < lines.length; i++) {
          let line = lines[i];
          for (let j = 0; j < mapWidth; j++) {
            let symbol = line[j];
            let x = mapOffsetX + 20 + j * 20; // Calcula la posición x ajustada para centrar el mapa
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
        // modificación para empezar a contar desde el suelo
        this.tiles.push(wallTile);
        break;
      }
      case "┌": {
        let wallTile = new Wall(images.itl_tile, x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        // modificación para empezar a contar desde el suelo
        this.tiles.push(wallTile);
        break;
      }
      case "┐": {
        let wallTile = new Wall(images.itr_tile, x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        // modificación para empezar a contar desde el suelo
        this.tiles.push(wallTile);
        break;
      }
      case "┘": {
        let wallTile = new Wall(images.ibr_tile, x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        // modificación para empezar a contar desde el suelo
        this.tiles.push(wallTile);
        break;
      }
      case "└": {
        let wallTile = new Wall(images.ibl_tile, x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        // modificación para empezar a contar desde el suelo
        this.tiles.push(wallTile);
        break;
      }
      case "─": {
        let wallTile = new Wall(images.t_tile, x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        // modificación para empezar a contar desde el suelo
        this.tiles.push(wallTile);
        break;
      }
      case "┤": {
        let wallTile = new Wall(images.r_tile, x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        // modificación para empezar a contar desde el suelo
        this.tiles.push(wallTile);
        break;
      }
      case "═": {
        let wallTile = new Wall(images.b_tile, x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        // modificación para empezar a contar desde el suelo
        this.tiles.push(wallTile);
        break;
      }
      case "├": {
        let wallTile = new Wall(images.l_tile, x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        // modificación para empezar a contar desde el suelo
        this.tiles.push(wallTile);
        break;
      }
      case "╔": {
        let wallTile = new Wall(images.tl_tile, x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        // modificación para empezar a contar desde el suelo
        this.tiles.push(wallTile);
        break;
      }
      case "╗": {
        let wallTile = new Wall(images.tr_tile, x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        // modificación para empezar a contar desde el suelo
        this.tiles.push(wallTile);
        break;
      }
      case "╝": {
        let wallTile = new Wall(images.br_tile, x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        // modificación para empezar a contar desde el suelo
        this.tiles.push(wallTile);
        break;
      }
      case "╚": {
        let wallTile = new Wall(images.bl_tile, x, y);
        wallTile.y = wallTile.y - wallTile.height / 2;
        // modificación para empezar a contar desde el suelo
        this.tiles.push(wallTile);
        break;
      }
    }
  }
}
