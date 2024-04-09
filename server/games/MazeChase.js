const { BaseGame, Statuses } = require("./BaseGame");

const Roles = {
  HAUNTER: "haunter",
  PURSUED: "pursued",
};

class MazeChase extends BaseGame {
  initializeGameState(room) {
    const state = {
      players: [],
      result: {
        status: Statuses.WAITING,
      },
    };
    room.state = state;
  }

  handleOnePlayer(room, socketId, data) {
    const rolesKeys = Object.keys(Roles);
    const randomIndex = Math.round(Math.random());
    room.state.players[0].role = Roles[rolesKeys[randomIndex]];
  }

  handleGameStart(room, socketId, data) {
    let firstPlayerRole = room.state.players[0].role;
    room.state.players[1].role = Object.values(Roles).find(
      (role) => role !== firstPlayerRole
    );
    room.state.players[1].movements = [];

    room.state.result.status = Statuses.PLAYING;
    this.updateGameState(room, "gameStart");
    this.startTurnTimer(room, 60);
  }

  handleAction(room, socketId, data) {
    if (room.state.result.status === Statuses.PLAYING) {
      const player = room.state.players.find((p) => p.id === socketId);
      if (data.nextDirection != null) {
        console.log("A")
        player.nextDirection = data.nextDirection;
      } else if (data.superPower) {
        // TODO
      }
      else if (data.haunted) {
        checkForEndOfGame(room);
      }
    }
    this.updateGameState(room, "gameState");
  }

  checkForEndOfGame(room) {
    if (this.state.result.status != Statuses.WIN) {
      const haunter = room.state.players.find((p) => p.role === Roles.HAUNTER);

      room.state.result.status = Statuses.WIN;
      room.state.result.winner = haunter;
    }
  }

  handleTurnTimeout(room) {
    const pursued = room.state.players.find((p) => p.role === Roles.PURSUED);

    room.state.result.status = Statuses.WIN;
    room.state.result.winner = pursued;

    this.updateGameState(room, "gameState");
  }
}

module.exports = MazeChase;
