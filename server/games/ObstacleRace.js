const { BaseGame, Statuses } = require('./BaseGame');

class ObstacleRace extends BaseGame {

    initializeGameState(room) {
        const obstacles = Array.from({ length: 20 }, () => Math.floor(Math.random()))

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

        return room.state.result.status == Statuses.WIN;
    }
}

module.exports = ObstacleRace;
