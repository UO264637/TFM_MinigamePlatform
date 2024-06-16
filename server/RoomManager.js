class RoomManager {
  constructor() {
    this.rooms = {};
    this.nextRoomId = 0;
  }

  createRoom(gameType) {
    this.nextRoomId++;

    let room = {
      gameType: gameType,
      state: null,
      turnTimer: 0,
    };

    this.rooms[this.nextRoomId] = room;

    return this.nextRoomId;
  }

  deleteRoom(roomId) {
    let now = new Date();
    console.log(
      `[${now.toLocaleDateString()} ${now.toLocaleTimeString()}] Deleted Room ${roomId} - ${this.rooms[roomId].gameType}`
    );
    delete this.rooms[roomId];
  }

  getRoom(roomId) {
    if (this.rooms.hasOwnProperty(roomId)) {
      return this.rooms[roomId];
    } else {
      return null;
    }
  }

  getRoomBySocketId(socketId) {
    let roomId = this.getRoomId(socketId);

    if (roomId != null) {
      return this.rooms[roomId];
    }

    return null;
  }

  getRoomId(socketId) {
    for (const roomId in this.rooms) {
      const gameState = this.rooms[roomId].state;
      const playerIndex = gameState.players.findIndex(
        (player) => player.id === socketId
      );
      if (playerIndex !== -1) {
        return roomId;
      }
    }
    return null;
  }

  getWaitingRooms() {
    const waitingRooms = Object.keys(this.rooms)
      .filter((roomId) => this.rooms[roomId].state.result.status == "waiting" 
        && this.rooms[roomId].state.players.length < this.rooms[roomId].state.maxPlayers
        && this.rooms[roomId].state.players.length > 0)
      .map((roomId) => ({
        roomId: roomId,
        gameType: this.rooms[roomId].gameType,
        players: this.rooms[roomId].state.players.map(
          (player) => player.playerName
        ),
        status: this.rooms[roomId].state.result.status,
      }));

    return waitingRooms;
  }
}

module.exports = new RoomManager();
