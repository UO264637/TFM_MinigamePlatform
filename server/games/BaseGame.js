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
            id: socketId
        };

        if (nPlayers === 0) {
            console.log('Room ' + data.roomId + " (1/2): " + data.playerName + " joined");

            room.state.players.push(newPlayer);
            this.updateGameState(room);
        }

        else if (nPlayers === 1) {
            console.log('Room ' + data.roomId + " (2/2): " + data.playerName + " joined");

            room.state.players.push(newPlayer);

            this.handleGameStart(room, socketId, data);
        }
    }

    handleGameStart(room, socketId, data) {
        room.state.result.status = Statuses.PLAYING;

        this.updateGameState(room);
    }

    handleDisconnect(room, socketId) {
        room.state.players = room.state.players.filter((p) => p.id != socketId);
        room.state.result.status = Statuses.WIN;
        room.state.result.winner = room.state.players[0];

        clearInterval(room.turnTimer);
        this.updateGameState(room);
    }

    startTurnTimer(room) {
        let secondsLeft = 16;

        room.turnTimer = setInterval(() => {
            secondsLeft--;

            this.io.to(room.state.players[0].id).emit('turnTimer', secondsLeft);
            this.io.to(room.state.players[1].id).emit('turnTimer', secondsLeft);

            if (secondsLeft <= 0) {
                this.handleTurnTimeout(room);
                secondsLeft = 15;
            }

        }, 1000);
    }

    handleTurnTimeout(room) {
        clearInterval(room.turnTimer);
        this.updateGameState(room);
    }

    updateGameState(room) {
        for (const player of room.state.players) {
            this.io.to(player.id).emit('gameState', room.state);
        }
    }
}

module.exports = {
    BaseGame,
    Statuses,
};