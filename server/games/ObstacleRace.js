const { BaseGame, Statuses } = require("./BaseGame");

class ObstacleRace extends BaseGame {
  initializeGameState(room) {
    const obstacles = Array.from({ length: 25 }, () =>
      Math.round(Math.random())
    );

    const state = {
      obstacles: obstacles,
      players: [],
      maxPlayers: 2,
      result: {
        status: Statuses.WAITING,
      },
    };
    room.state = state;
  }

  handleGameStart(room, socketId, data) {
    room.state.players.map(player => {
      player.position = 0;
    });

    if (room.state.result.status == Statuses.WAITING) {
      this.updateGameState(room, "gameStart");
      room.state.result.status = Statuses.PLAYING;
    }
  }

  handleAction(room, socketId, data) {
    const player = room.state.players.find((p) => p.id === socketId);
    player.position += 1;

    if (this.checkForEndOfGame(room)) {
      setTimeout(() => {
        this.updateGameState(room, "gameFinished");
      }, 500);
    }

    this.updateGameState(room, "gameState");
  }

  checkForEndOfGame(room) {
    let playersAbove25 = 0;

    room.state.players.forEach((player) => {
      if (player.position >= 25) {
        playersAbove25++;
        room.state.result.status = Statuses.WIN;
        room.state.result.winner = player;
      }
    });

    if (playersAbove25 === 2) {
      room.state.result.status = Statuses.DRAW;
    }

    return (
      room.state.result.status === Statuses.WIN ||
      room.state.result.status === Statuses.DRAW
    );
  }
}

module.exports = ObstacleRace;
