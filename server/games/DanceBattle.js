const { BaseGame, Statuses } = require("./BaseGame");

const roles = ["imitated", "imitator"];

class DanceBattle extends BaseGame {
  initializeGameState(room) {
    const movementSet = Array.from({ length: 4 }, () =>
      Math.round(Math.random() * 6)
    );

    const state = {
      movementSet: movementSet,
      currentPlayer: null,
      players: [],
      result: {
        status: Statuses.WAITING,
      },
    };
    room.state = state;
  }

  handleOnePlayer(room, socketId, data) {
    let role = Math.round(Math.random());
    room.state.players[0].role = roles[role];
  }

  handleGameStart(room, socketId, data) {
    let role = roles.find((role) => role !== room.state.players[0].role); // imitated or imitator
    room.state.players[1].role = role;

    room.state.currentPlayer = room.state.players.find(
      (player) => player.symbol === "imitated"
    );
    room.state.result.status = Statuses.PLAYING;

    this.startTurnTimer(room);
  }

  handleAction(room, socketId, data) {
    if (
      room.state.result.status === Statuses.PLAYING &&
      room.state.currentPlayer.id === socketId
    ) {
      const player = room.state.players.find((p) => p.id === socketId);
      if (room.state.board[data.gridIndex] == null) {
        room.state.board[data.gridIndex] = player;
        room.state.currentPlayer = room.state.players.find((p) => p !== player);

        clearInterval(room.turnTimer);

        if (!this.checkForEndOfGame(room)) {
          this.startTurnTimer(room);
        }
      }
    }
    this.this.updateGameState(room, "gameState");
  }

  checkForEndOfGame(room) {
    // Check for a win
    room.state.players.forEach((player) => {
      winPatterns.forEach((seq) => {
        if (
          room.state.board[seq[0]] == player &&
          room.state.board[seq[1]] == player &&
          room.state.board[seq[2]] == player
        ) {
          room.state.result.status = Statuses.WIN;
          room.state.result.winner = player;
        }
      });
    });

    // Check for a draw
    if (room.state.result.status != Statuses.WIN) {
      const emptyBlock = room.state.board.indexOf(null);
      if (emptyBlock == -1) {
        room.state.result.status = Statuses.DRAW;
        return true;
      }
    } else {
      return true;
    }

    return false;
  }

  handleTurnTimeout(room) {
    const randomEmptyIndex = this.getRandomEmptyIndex(room.state.board);

    if (randomEmptyIndex !== -1) {
      const currentPlayer = room.state.currentPlayer;
      room.state.board[randomEmptyIndex] = currentPlayer;
    }

    clearInterval(room.turnTimer);
    if (!this.checkForEndOfGame(room)) {
      this.startTurnTimer(room);
      this.switchPlayer(room);
    } else {
      this.this.updateGameState(room, "gameState");
    }
  }

  switchPlayer(room) {
    room.state.currentPlayer = room.state.players.find(
      (p) => p !== room.state.currentPlayer
    );

    this.this.updateGameState(room, "gameState");
  }

  getRandomEmptyIndex(board) {
    const emptyIndices = [];

    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        emptyIndices.push(i);
      }
    }

    if (emptyIndices.length === 0) {
      return -1;
    }

    const randomIndex = Math.floor(Math.random() * emptyIndices.length);
    return emptyIndices[randomIndex];
  }
}

module.exports = TicTacToe;
