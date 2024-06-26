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
    if (room.state.players.length >= room.state.maxPlayers) {
      this.io.to(socketId).emit("error", { message: "Room is full", error: "FULL" });
      return;
    }

    const newPlayer = {
      playerName: data.playerName.substring(0, 12),
      id: socketId,
    };
    room.state.players.push(newPlayer);

    let nPlayers = room.state.players.length;
    let now = new Date();
    console.log(
      `[${now.toLocaleDateString()} ${now.toLocaleTimeString()}] Room ${data.roomId} - ${room.gameType} (${nPlayers}/${room.state.maxPlayers}): ${data.playerName}`
    );

    this.updateGameState(room, "gameState");
  }

  handleReadyPlayer(room, socketId) {
    if (room.state.result.status != Statuses.PLAYING) {
      const player = room.state.players.find((p) => p.id === socketId);
      player.ready = true;

      const allReady = room.state.players.every((p) => p.ready);

      if (room.state.players.length >= room.state.maxPlayers && allReady) {
        room.state.result.status = Statuses.WAITING;
        this.handleGameStart(room);
        room.state.players.forEach((p) => {
          p.ready = false;
        });
      }
      this.updateGameState(room, "gameState");
    }
  }

  handleGameStart(room) {
    if (room.state.result.status == Statuses.WAITING) {
      this.updateGameState(room, "gameStart");
      room.state.result.status = Statuses.PLAYING;
    }
  }

  handleDisconnect(room, socketId) {
    room.state.players = room.state.players.filter((p) => p.id != socketId);
    if (room.state.result.status == Statuses.PLAYING) {
      room.state.result.status = Statuses.WIN;
      room.state.result.winner = room.state.players[0];
      clearInterval(room.turnTimer);
      this.updateGameState(room, "gameFinished");
    }
    this.updateGameState(room, "gameState");
  }

  handlePlayAgain(room, socketId) {
    if (room.state.result.status != Statuses.WAITING) {
      let players = room.state.players;
      this.initializeGameState(room);
      room.state.players = players;
    }

    this.handleReadyPlayer(room, socketId);
  }

  startTurnTimer(room, time) {
    let secondsLeft = time + 1;

    room.turnTimer = setInterval(() => {
      secondsLeft--;

      for (const player of room.state.players) {
        this.io.to(player.id).emit("turnTimer", secondsLeft);
      }

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
