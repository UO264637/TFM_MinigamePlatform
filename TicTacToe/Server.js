var express = require('express')
var http = require('http');

var app = express();
const cors = require('cors');
app.use(cors());
var server = http.createServer(app);

const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

const Statuses = {
    WAITING: "waiting",
    PLAYING: "playing",
    DRAW: "draw",
    WIN: "win",
};

let games = {};
let nextGameId = 0;

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

function initializeGameState() {
    return {
        board: new Array(9).fill(null),
        currentPlayer: null,
        players: [],
        result: {
            status: Statuses.WAITING,
        }
    };
}

io.on('connection', function (socket) {
    console.log('Client connected:', socket.id);
    turnTimer = null;

    socket.on("joinGame", function (data) {
        joinGame(socket.id, data);
    });

    socket.on("action", function (data) {
        action(socket.id, data);
    });

    socket.on("disconnect", function () {
        disconnect(socket.id);
    });

});

function joinGame(socketId, data) {
    let gameId = findWaitingRoom();

    if (gameId != -1) {
        console.log('Room ' + gameId +" (2/2): "+ data.playerName + " joined");

        let symbols = ["X", "O"];
        let symbol = Math.round(Math.random());
        const newPlayer = {
            playerName: data.playerName,
            id: socketId,
            symbol: symbols[symbol],
        };

        games[gameId].state.players[0].symbol = symbols[1 - symbol]
        games[gameId].state.players.push(newPlayer);
        games[gameId].state.currentPlayer =  games[gameId].state.players[Math.round(Math.random())];
        games[gameId].state.result.status = Statuses.PLAYING;

        startTurnTimer(gameId);
        updateGameState(gameId)
    }
    else {
        nextGameId++;
        console.log('Room ' + nextGameId +" (1/2): "+ data.playerName + " joined");

        games[nextGameId] = {
            state: initializeGameState(),
            turnTimer: 0
        };

        const newPlayer = {
            playerName: data.playerName,
            id: socketId,
            symbol: "",
        };

        games[nextGameId].state.players.push(newPlayer);
        updateGameState(nextGameId)
    }

}

function action(socketId, data) {
    const gameId = getGameId(socketId);

    if (
        games[gameId].state.result.status === Statuses.PLAYING &&
        games[gameId].state.currentPlayer.id === socketId
    ) {
        console.log("\t"+ games[gameId].state.currentPlayer.playerName + " action");

        const player = games[gameId].state.players.find((p) => p.id === socketId);
        if (games[gameId].state.board[data.gridIndex] == null) {
            games[gameId].state.board[data.gridIndex] = player;
            games[gameId].state.currentPlayer = games[gameId].state.players.find((p) => p !== player);

            clearInterval(games[gameId].turnTimer);

            if (!checkForEndOfGame(gameId)) {
                startTurnTimer(gameId);
            }
        }
    }
    updateGameState(gameId)
}

function disconnect(socketId) {
    console.log('Client disconnected:', socketId);
    
    const gameId = getGameId(socketId);
    if (gameId != -1) {

        games[gameId].state.players = games[gameId].state.players.filter((p) => p.id != socketId);
        games[gameId].state.result.status = Statuses.WIN;
        games[gameId].state.result.winner = games[gameId].state.players[0];
        clearInterval(games[gameId].turnTimer);

        updateGameState(gameId);        
    }
}

function checkForEndOfGame(gameId) {
    // Check for a win
    games[gameId].state.players.forEach((player) => {
        winPatterns.forEach((seq) => {
            if (
                games[gameId].state.board[seq[0]] == player &&
                games[gameId].state.board[seq[1]] == player &&
                games[gameId].state.board[seq[2]] == player
            ) {
                games[gameId].state.result.status = Statuses.WIN;
                games[gameId].state.result.winner = player;
            }
        });
    });

    // Check for a draw
    if (games[gameId].state.result.status != Statuses.WIN) {
        const emptyBlock = games[gameId].state.board.indexOf(null);
        if (emptyBlock == -1) {
            games[gameId].state.result.status = Statuses.DRAW;
            return true;
        }
    }
    else {
        return true;
    }

    return false;
}

function startTurnTimer(gameId) {
    let secondsLeft = 16;

    games[gameId].turnTimer = setInterval(() => {
        secondsLeft--;

        io.to(games[gameId].state.players[0].id).emit('turnTimer', secondsLeft);
        io.to(games[gameId].state.players[1].id).emit('turnTimer', secondsLeft);

        if (secondsLeft <= 0) {
            handleTurnTimeout(gameId);
            secondsLeft = 15;
        }

    }, 1000);
}

function handleTurnTimeout(gameId) {
    const randomEmptyIndex = getRandomEmptyIndex(games[gameId].state.board);

    if (randomEmptyIndex !== -1) {
        const currentPlayer = games[gameId].state.currentPlayer;
        games[gameId].state.board[randomEmptyIndex] = currentPlayer;
    }

    clearInterval(games[gameId].turnTimer);
    if (!checkForEndOfGame(gameId)) {
        startTurnTimer(gameId);
        switchPlayer(gameId);
    } else {
        updateGameState(gameId)
    }
}


function switchPlayer(gameId) {
    games[gameId].state.currentPlayer = games[gameId].state.players.find(
        (p) => p !== games[gameId].state.currentPlayer
    );

    updateGameState(gameId)
}

function getRandomEmptyIndex(board) {
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

function findWaitingRoom() {
    for (const gameId in games) {
        const gameState = games[gameId].state;
        if (gameState.result.status == Statuses.WAITING) {
            return gameId;
        }
    }
    return -1;
}

function getGameId(socketId) {
    for (const gameId in games) {
        const gameState = games[gameId].state;
        const playerIndex = gameState.players.findIndex(player => player.id === socketId);
        if (playerIndex !== -1) {
            return gameId;
        }
    }
    return -1;
}

function updateGameState(gameId) {
    for (const player of games[gameId].state.players) {
        io.to(player.id).emit('gameState', games[gameId].state);
    }
}

server.listen(3000, () => {
    console.log('listening on *:3000');
});