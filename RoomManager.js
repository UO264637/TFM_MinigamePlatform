class RoomManager {
    constructor() {
        this.rooms = {};
        this.nextRoomId = 0;
    }

    getRoom(roomId) {
        return this.rooms[roomId];
    }

    getActiveRooms() {
        const activeRooms = Object.keys(this.rooms).map((roomId) => {
            return {
                roomId: roomId,
                players: this.rooms[roomId].state.players.map((player) => player.playerName),
                status: this.rooms[roomId].state.result.status,
            };
        });
    
        return activeRooms;
    }

    getRoomId(socketId) {
        for (const roomId in this.rooms) {
            const gameState = this.rooms[roomId].state;
            const playerIndex = gameState.players.findIndex(player => player.id === socketId);
            if (playerIndex !== -1) {
                return roomId;
            }
        }
        return -1;
    }

    createRoom(gameType) {
        this.nextRoomId++;
        console.log('Room ' + this.nextRoomId +" created");

        this.rooms[this.nextRoomId] = {
            gameType: gameType,
            state: null,
            turnTimer: 0
        };

        return this.nextRoomId;
    }
}

module.exports = new RoomManager();