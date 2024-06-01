const { BaseGame, Statuses } = require("./BaseGame");

class CabooseCount extends BaseGame {
  initializeGameState(room) {
    const elements = Array.from({ length: 56 }, () =>
      Math.round(Math.random() * 3)
    );

    const state = {
      elements: elements,
      toCount: Math.round(Math.random() * 2) + 1,
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
      player.count = -1;
    });

    if (room.state.result.status == Statuses.WAITING) {
      this.updateGameState(room, "gameStart");
      room.state.result.status = Statuses.PLAYING;
    }
  }

  handleAction(room, socketId, data) {
    const player = room.state.players.find((p) => p.id === socketId);
    if (data.readyToCount) {
      player.readyToCount = true;
      let allReady = room.state.players.every((p) => p.readyToCount);
      if (allReady) {
        room.state.readyToCount = true;
        this.startTurnTimer(room, 10);
        this.updateGameState(room, "gameState");
      }
    }
    else {
      player.count = data.count;
      this.checkForEndOfGame(room);
    }
  }

  checkForEndOfGame(room) {
    let playerAnswers = room.state.players.filter((player) => player.count > -1)
                                          .map((player) => player.count);
    room.state.solution = room.state.elements.filter((element) => element == room.state.toCount).length;
    let possibleWinner = room.state.players.filter((player) => player.count == room.state.solution)[0];

    if (playerAnswers.length >= room.state.maxPlayers) {
      if (playerAnswers.every((answer) => answer == room.state.solution)) {
        room.state.result.status = Statuses.DRAW;
      } else if (possibleWinner != null) {
        room.state.result.status = Statuses.WIN;
        room.state.result.winner = possibleWinner;
      } else {
        room.state.result.status = Statuses.DRAW;
      }
    }

    if (
      room.state.result.status == Statuses.WIN ||
      room.state.result.status == Statuses.DRAW
    ) {
      setTimeout(() => {
        this.updateGameState(room, "gameFinished");
        this.updateGameState(room, "gameState");
      }, 4000);
      this.updateGameState(room, "gameState");
    }
  }

  handleTurnTimeout(room) {
    clearInterval(room.turnTimer);
  }
}

module.exports = CabooseCount;
