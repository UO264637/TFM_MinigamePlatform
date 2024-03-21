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

    if (imitator.movements.length == imitated.movements.length) {
      room.state.currentPlayer = imitated;
      clearInterval(room.turnTimer);

      if (room.state.round != Rounds.THIRD) {
        room.state.round += 2; // Incrementar la ronda
        imitated.movements = [];
        imitator.movements = [];

        this.startTurnTimer(room, 10 + room.state.round);
      } else {
        room.state.result.status = Statuses.WIN;
        room.state.result.winner = imitated;
      }
    } else if (
      imitator.movements.length == 0 &&
      imitated.movements.length == room.state.round
    ) {
      room.state.currentPlayer = imitator;
      clearInterval(room.turnTimer);
      this.startTurnTimer(room, 10 + room.state.round);
    }
  }

  handleTurnTimeout(room) {
    clearInterval(room.turnTimer);

    if (room.state.currentPlayer.Roles == Roles.IMITATED) {
      this.switchPlayer(room);
      this.startTurnTimer(room, 10 + room.state.round);
    } else if (imitator.movements.length < imitated.movements.length) {
      room.state.result.status = Statuses.WIN;
      room.state.result.winner = imitated;
    }
    this.this.updateGameState(room, "gameState");
  }
}

module.exports = DanceBattle;
