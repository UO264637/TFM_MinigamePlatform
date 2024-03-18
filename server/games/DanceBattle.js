const { BaseGame, Statuses } = require("./BaseGame");

const Roles = {
  IMITATED: "imitated",
  IMITATOR: "imitator"
};

const Rounds = {
  FIRST: 3,
  SECOND: 5,
  THIRD: 7
};

class DanceBattle extends BaseGame {
  initializeGameState(room) {
    const movementSet = Array.from({ length: 4 }, () =>
      Math.round(Math.random() * 6)
    );

    const state = {
      movementSet: movementSet,
      currentSequence: [],
      currentPlayer: null,
      round: Rounds.FIRST,
      players: [],
      result: {
        status: Statuses.WAITING,
      },
    };
    room.state = state;
  }

  handleOnePlayer(room, socketId, data) {
    const rolesKeys = Object.keys(Roles);
    const randomIndex =  Math.round(Math.random());
    room.state.players[0].role = rolesKeys[randomIndex];
  }

  handleGameStart(room, socketId, data) {
    let firstPlayerRole = room.state.players[0].role;
    room.state.players[1].role = Object.values(Roles).find(role => role !== firstPlayerRole);

    room.state.currentPlayer = room.state.players.find(
      (player) => player.role == "imitated"
    );
    room.state.result.status = Statuses.PLAYING;

    this.startTurnTimer(room, 10);
  }

  handleAction(room, socketId, data) {
    if (
      room.state.result.status === Statuses.PLAYING &&
      room.state.currentPlayer.id === socketId
    ) {
      const player = room.state.players.find((p) => p.id === socketId);
      if (player.role == Roles.IMITATED) {
        room.state.currentSequence.push(data.movement);
        checkForEndOfRound(room);
      }
      else if (player.role == Roles.IMITATOR) {
        
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
