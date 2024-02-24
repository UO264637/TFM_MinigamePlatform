const Statuses = {
    WAITING: "waiting",
    PLAYING: "playing",
    DRAW: "draw",
    WIN: "win",
};

const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

class TicTacToe {
    constructor(io) {
        this.io = io;
    }

    initializeGameState(room) {
        const state = {
            board: new Array(9).fill(null),
            currentPlayer: null,
            players: [],
            result: {
                status: Statuses.WAITING,
            }
        };
        room.state = state;
        console.log(room.state)
    }

    handleGameStart(room, socketId, data) {
        let symbols = ["X", "O"];
        let symbol = Math.round(Math.random());

        room.state.players[0].symbol = symbols[symbol]
        room.state.players[1].symbol = symbols[1 - symbol]
        room.state.currentPlayer = room.state.players[Math.round(Math.random())];
        room.state.result.status = Statuses.PLAYING;

        this.startTurnTimer(room);
    }

    handleAction(room, socketId, data) {
        if (
            room.state.result.status === Statuses.PLAYING &&
            room.state.currentPlayer.id === socketId
        ) {
            const player = room.state.players.find((p) => p.id === socketId);
            if (room.state.board[data.gridIndex] == null) {
                room.state.board[data.gridIndex] = player;
                room.state.currentPlayer = room.state.players.find((p) => p !== player);

                clearInterval(room.turnTimer);

                if (!this.checkForEndOfGame(room)) {
                    this.startTurnTimer(room);
                }
            }
        }
    }

    handleDisconnect(room, socketId) {
        room.state.players = room.state.players.filter((p) => p.id != socketId);
        room.state.result.status = Statuses.WIN;
        room.state.result.winner = room.state.players[0];
        clearInterval(room.turnTimer);
    }

    checkForEndOfGame(room) {
        // Check for a win
        room.state.players.forEach((player) => {
            winPatterns.forEach((seq) => {
                if (
                    room.state.board[seq[0]] == player &&
                    room.state.board[seq[1]] == player &&
                    room.state.board[seq[2]] == player
                ) {
                    room.state.result.status = Statuses.WIN;
                    room.state.result.winner = player;
                }
            });
        });
    
        // Check for a draw
        if (room.state.result.status != Statuses.WIN) {
            const emptyBlock = room.state.board.indexOf(null);
            if (emptyBlock == -1) {
                room.state.result.status = Statuses.DRAW;
                return true;
            }
        }
        else {
            return true;
        }
    
        return false;
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
        const randomEmptyIndex = this.getRandomEmptyIndex(room.state.board);
    
        if (randomEmptyIndex !== -1) {
            const currentPlayer = room.state.currentPlayer;
            room.state.board[randomEmptyIndex] = currentPlayer;
        }
    
        clearInterval(room.turnTimer);
        if (!this.checkForEndOfGame(room)) {
            this.startTurnTimer(room);
            this.switchPlayer(room);
        } else {
            this.updateGameState(room)
        }
    }
    
    
    switchPlayer(room) {
        room.state.currentPlayer = room.state.players.find(
            (p) => p !== room.state.currentPlayer
        );
    
        this.updateGameState(room)
    }
    
    getRandomEmptyIndex(board) {
        const emptyIndices = [];
    
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                emptyIndices.push(i);
            }
        }
    
        if (emptyIndices.length === 0) {
            return -1;
        }
    
        const randomIndex = Math.floor(Math.random() * emptyIndices.length);
        return emptyIndices[randomIndex];
    }

    updateGameState(room) {    
        for (const player of room.state.players) {
            this.io.to(player.id).emit('gameState', room.state);
        }
    }
}

module.exports = TicTacToe;
