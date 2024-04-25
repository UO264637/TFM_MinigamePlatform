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
    const state = {
      movementsToPlay: [],
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
    room.state.players[0].role = Roles[rolesKeys[randomIndex]];
    room.state.players[0].movements = [];
  }

  handleGameStart(room, socketId, data) {
    let firstPlayerRole = room.state.players[0].role;
    room.state.players[1].role = Object.values(Roles).find(
      (role) => role !== firstPlayerRole
    );
    room.state.players[1].movements = [];

    room.state.currentPlayer = room.state.players.find(
      (player) => player.role == Roles.IMITATED
    );
    
    if (room.state.result.status == Statuses.WAITING) {
      this.updateGameState(room, "gameStart");
      room.state.result.status = Statuses.PLAYING;
      setTimeout(() => {
        this.startTurnTimer(room, 10);
      }, 3000);
    }
  }

  handleAction(room, socketId, data) {
    if (
      room.state.result.status === Statuses.PLAYING &&
      room.state.currentPlayer.id === socketId
    ) {
      let newMovements = data.movements.slice(0, room.state.round); // Ensures there aren't more movements tha it should
      room.state.currentPlayer.movements = newMovements;
      if (this.verifyMovements(room)) {
        this.checkForEndOfTurn(room);
      }
    }
    this.updateGameState(room, "gameState");
  }

  verifyMovements(room) {
    const imitated = room.state.players.find((p) => p.role === Roles.IMITATED);
    const imitator = room.state.players.find((p) => p.role === Roles.IMITATOR);

    if (room.state.currentPlayer == imitated) {
      const completeMovements = Array.from(
        { length: room.state.round },
        (_, index) => imitated.movements[index] || "space"
      ); // Ensures there are 3, 5 or 7 movements
      imitated.movements = completeMovements;
      return true;
    } else if (
      imitator.movements.toString() === imitated.movements.toString()
    ) {
      return true;
    } else {
      room.state.movementsToPlay = room.state.currentPlayer.movements;
      this.switchPlayer(room);
      clearInterval(room.turnTimer);
      room.state.result.status = Statuses.WIN;
      room.state.result.winner = imitated;
      return false;
    }
  }

  checkForEndOfTurn(room) {
    const imitated = room.state.players.find((p) => p.role === Roles.IMITATED);
    const imitator = room.state.players.find((p) => p.role === Roles.IMITATOR);

    room.state.movementsToPlay = room.state.currentPlayer.movements;

    if (room.state.currentPlayer == imitator) {
      room.state.currentPlayer = imitated;
      clearInterval(room.turnTimer);

      if (room.state.round != Rounds.THIRD) {
        room.state.round += 2; // Incrementar la ronda
        imitated.movements = [];
        imitator.movements = [];

        this.startTurnTimer(room, 10 + room.state.round);
      } else {
        room.state.result.status = Statuses.WIN;
        room.state.result.winner = imitator;
      }
    } else {
      room.state.currentPlayer = imitator;
      clearInterval(room.turnTimer);
      this.startTurnTimer(room, 10 + room.state.round);
    }
  }

  handleDisconnect(room, socketId) {
    room.state.movementsToPlay = [];
    super.handleDisconnect(room, socketId);
  }

  handleTurnTimeout(room) {
    clearInterval(room.turnTimer);
    const imitated = room.state.players.find((p) => p.role === Roles.IMITATED);
    const imitator = room.state.players.find((p) => p.role === Roles.IMITATOR);

    if (room.state.currentPlayer.role == Roles.IMITATED) {
      this.switchPlayer(room);
      this.startTurnTimer(room, 10 + room.state.round);
    } else if (imitator.movements.length < imitated.movements.length) {
      room.state.result.status = Statuses.WIN;
      room.state.result.winner = imitated;
    }
    this.updateGameState(room, "gameState");
  }
}

module.exports = DanceBattle;
