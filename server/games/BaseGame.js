const Statuses = {
  WAITING: "waiting",
  PLAYING: "playing",
  DRAW: "draw",
  WIN: "win",
};

class BaseGame {
  constructor(io) {
    this.io = io;
  }

  handleJoinGame(room, socketId, data) {
    let nPlayers = room.state.players.length;

    const newPlayer = {
      playerName: data.playerName,
      id: socketId,
    };

    if (nPlayers === 0) {
      console.log(
        "Room " + data.roomId + " (1/2): " + data.playerName + " joined"
      );

      room.state.players.push(newPlayer);

      this.handleOnePlayer(room, socketId, data);
      this.updateGameState(room, "gameState");
    } else if (nPlayers === 1) {
      console.log(
        "Room " + data.roomId + " (2/2): " + data.playerName + " joined"
      );

      room.state.players.push(newPlayer);

      this.handleGameStart(room, socketId, data);
      this.updateGameState(room, "gameState");
    }
  }

  handleOnePlayer(room, socketId, data) {
    throw new Error("Abstract method not implemented");
  }

  handleReadyPlayer(room, socketId) {
    const player = room.state.players.find((p) => p.id === socketId);
    player.ready = true;

    const allReady = room.state.players.every((p) => p.ready);

    if (allReady) {
      this.handleGameStart(room, null, null);
    } else {
      this.updateGameState(room, "gameState");
    }
  }

  handleGameStart(room, socketId, data) {
    this.updateGameState(room, "gameStart");
    room.state.result.status = Statuses.PLAYING;
  }

  handleDisconnect(room, socketId) {
    room.state.players = room.state.players.filter((p) => p.id != socketId);
    if (
      room.state.result.status != Statuses.WIN &&
      room.state.result.status != Statuses.DRAW
    ) {
      room.state.result.status = Statuses.WIN;
      room.state.result.winner = room.state.players[0];
    }

    clearInterval(room.turnTimer);
    this.updateGameState(room, "gameState");
  }

  startTurnTimer(room, time) {
    let secondsLeft = time + 1;

    room.turnTimer = setInterval(() => {
      secondsLeft--;

      this.io.to(room.state.players[0].id).emit("turnTimer", secondsLeft);
      this.io.to(room.state.players[1].id).emit("turnTimer", secondsLeft);

      if (secondsLeft <= 0) {
        this.handleTurnTimeout(room);
        secondsLeft = time;
      }
    }, 1000);
  }

  handleTurnTimeout(room) {
    clearInterval(room.turnTimer);
    this.updateGameState(room, "gameState");
  }

  switchPlayer(room) {
    room.state.currentPlayer = room.state.players.find(
      (p) => p !== room.state.currentPlayer
    );
  }

  updateGameState(room, message) {
    for (const player of room.state.players) {
      this.io.to(player.id).emit(message, room.state);
    }
  }
}

module.exports = {
  BaseGame,
  Statuses,
};
