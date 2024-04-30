const { BaseGame, Statuses } = require("./BaseGame");

class CabooseCount extends BaseGame {
  initializeGameState(room) {
    const elements = Array.from({ length: 56 }, () =>
      Math.round(Math.random() * 4)
    );

    const state = {
      elements: elements,
      toCount: Math.round(Math.random() * 3) + 1,
      players: [],
      maxPlayers: 2,
      result: {
        status: Statuses.WAITING,
      },
    };
    room.state = state;
  }

  handleGameStart(room, socketId, data) {
    room.state.players.map((player) => {
      player.count = 0;
    });

    if (room.state.result.status == Statuses.WAITING) {
      this.updateGameState(room, "gameStart");
      room.state.result.status = Statuses.PLAYING;
      setTimeout(() => {
        this.startTurnTimer(room, 30);
      }, 3000);
    }
  }

  handleAction(room, socketId, data) {
    const player = room.state.players.find((p) => p.id === socketId);
    player.count = data.count;

    this.checkForEndOfGame(room);
  }

  checkForEndOfGame(room) {
    let playerAnswers = room.state.players.filter((player) => player.count > 0);
    room.state.solution = room.state.elements.filter((element) => element == room.state.toCount).length;
    let possibleWinner = room.state.players.filter((player) => player.count == room.state.solution)[0];

    if (playerAnswers.length >= room.state.maxPlayers) {
      if (playerAnswers.every((answer) => answer == playerAnswers[0])) {
        room.state.result.status = Statuses.DRAW;
      } else if (possibleWinner != null) {
        room.state.result.status = Statuses.WIN;
        room.state.result.winner = possibleWinner;
      }
    }

    if (
      room.state.result.status == Statuses.WIN ||
      room.state.result.status == Statuses.DRAW
    ) {
      setTimeout(() => {
        this.updateGameState(room, "gameFinished");
      }, 500);
      this.updateGameState(room, "gameState");
    }
  }

  handleTurnTimeout(room) {
    clearInterval(room.turnTimer);

    this.checkForEndOfGame(room);
  }
}

module.exports = CabooseCount;
