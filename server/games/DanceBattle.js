const { BaseGame, Statuses } = require("./BaseGame");

const Roles = {
  IMITATED: "imitated",
  IMITATOR: "imitator",
};

const Rounds = {
  FIRST: 3,
  SECOND: 5,
  THIRD: 7,
};

class DanceBattle extends BaseGame {
  initializeGameState(room) {
    const movementSet = Array.from({ length: 4 }, () =>
      Math.round(Math.random() * 6)
    );

    const state = {
      movementSet: movementSet,
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
    const randomIndex = Math.round(Math.random());
    room.state.players[0].role = rolesKeys[randomIndex];
    room.state.players[0].movements = 0;
  }

  handleGameStart(room, socketId, data) {
    let firstPlayerRole = room.state.players[0].role;
    room.state.players[1].role = Object.values(Roles).find(
      (role) => role !== firstPlayerRole
    );
    room.state.players[1].movements = 0;

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
      player.movements.push(data.movement);
      if (verifyMovements(room)) {
        checkForEndOfTurn(room);
      }
    }
    this.updateGameState(room, "gameState");
  }

  verifyMovements(room) {
    const imitated = room.state.players.find((p) => p.role === Roles.IMITATED);
    const imitator = room.state.players.find((p) => p.role === Roles.IMITATOR);

    for (let i = 0; i < imitator.movements.length; i++) {
      if (imitator.movements[i] != imitated.movements[i]) {
        room.state.result.status = Statuses.WIN;
        room.state.result.winner = imitated;
        return false;
      }
    }
    return true;
  }

  checkForEndOfTurn(room) {
    const imitated = room.state.players.find((p) => p.role === Roles.IMITATED);
    const imitator = room.state.players.find((p) => p.role === Roles.IMITATOR);

    if (imitator.movements.length == room.state.round) {
      room.state.currentPlayer = imitated;
      if (room.state.round != Rounds.THIRD) {
        room.state.round += 2; // Incrementar la ronda
        imitated.movements = [];
        imitator.movements = [];
      } else {
        room.state.result.status = Statuses.WIN;
          room.state.result.winner = imitated;
      }
    } else if (
      imitator.movements.length == 0 &&
      imitated.movements.length == room.state.round
    ) {
      room.state.currentPlayer = imitator;
    }
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

module.exports = DanceBattle;
