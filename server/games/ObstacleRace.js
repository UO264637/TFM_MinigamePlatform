const { BaseGame, Statuses } = require('./BaseGame');

class ObstacleRace extends BaseGame {
    constructor(io) {
        super(io);
    }

    initializeGameState(room) {
        const obstacles = Array.from({ length: 20 }, Math.random())

        const state = {
            obstacles: obstacles,
            players: [],
            result: {
                status: Statuses.WAITING,
            }
        };
        room.state = state;
    }

    handleOnePlayer(room, socketId, data) {
        room.state.players[0].position = 0;
    }

    handleGameStart(room, socketId, data) {
        room.state.players[1].position = 0;

        room.state.result.status = Statuses.PLAYING;

        this.startTurnTimer(room);
    }

    handleAction(room, socketId, data) {
        const player = room.state.players.find((p) => p.id === socketId);
        player.position += 1;

        this.checkForEndOfGame(room);

        this.updateGameState(room);
    }

    checkForEndOfGame(room) {
        room.state.players.forEach((player) => {
            if (player.position >= 25) {
                room.state.result.status = Statuses.WIN;
                room.state.result.winner = player;
            }
        });

        if (room.state.result.status == Statuses.WIN) {
            return true;
        }
        else {
            return false;
        }
    }
}

module.exports = ObstacleRace;
