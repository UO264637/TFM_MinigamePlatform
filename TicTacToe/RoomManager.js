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
                players: rooms[roomId].state.players.map((player) => player.playerName),
                status: rooms[roomId].state.result.status,
            };
        });
    
        return activeRooms;
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

module.exports = RoomManager;