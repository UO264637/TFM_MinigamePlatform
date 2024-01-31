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

var total = 0;
var turnTimer = 0;

const Statuses = {
    WAITING: "waiting",
    PLAYING: "playing",
    DRAW: "draw",
    WIN: "win",
};

let gameState = {
    board: new Array(9).fill(null),
    currentPlayer: null,
    players: [],
    result: {
        status: Statuses.WAITING,
    },
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

io.on('connection', function (connection) {
    console.log('Client connected:', connection.id);
    turnTimer = null;

    connection.on("addPlayer", function (data) {
        addPlayer(connection.id, data);
    });
    connection.on("action", function (data) {
        action(connection.id, data);
    });

    connection.on("rematch", function () {
        rematch(connection.id);
    });

    connection.on("disconnect", function () {
        disconnect(connection.id);
    });

});

function addPlayer(socketId, data) {
    console.log('Player added:', data.playerName);

    const numberOfPlayers = gameState.players.length;
    if (numberOfPlayers >= 2) {
        return;
    }

    let nextSymbol = "X";
    if (numberOfPlayers === 1) {
        if (gameState.players[0].symbol === "X") {
            nextSymbol = "O";
        }
    }

    const newPlayer = {
        playerName: data.playerName,
        id: socketId,
        symbol: nextSymbol,
    };

    gameState.players.push(newPlayer);
    if (gameState.players.length === 2) {
        console.log('Two players');
        gameState.result.status = Statuses.PLAYING;
        gameState.currentPlayer = newPlayer;
        startTurnTimer();
    }
    else {
        console.log('One player');
    }
    io.emit("gameState", gameState);
}

function action(socketId, data) {
    console.log("action");
    if (
        gameState.result.status === Statuses.PLAYING &&
        gameState.currentPlayer.id === socketId
    ) {
        const player = gameState.players.find((p) => p.id === socketId);
        if (gameState.board[data.gridIndex] == null) {
            gameState.board[data.gridIndex] = player;
            gameState.currentPlayer = gameState.players.find((p) => p !== player);

            clearInterval(turnTimer);

            if (!checkForEndOfGame()) {         
                startTurnTimer();
            }
        }
    }
    io.emit("gameState", gameState);
}

function resetGame() {
    console.log("reset");
    gameState.board = new Array(9).fill(null);

    if (gameState.players.length === 2) {
        gameState.result.status = Statuses.PLAYING;
        const randPlayer = Math.floor(Math.random() * gameState.players.length);
        gameState.currentPlayer = gameState.players[randPlayer];
    } else {
        gameState.result.status = Statuses.WAITING;
        gameState.currentPlayer = null;
    }
}

function disconnect(socketId) {
    console.log('Client disconnected:', socketId);

    gameState.players = gameState.players.filter((p) => p.id != socketId);
    if (gameState.players !== 2) {
        clearInterval(turnTimer);
        resetGame();
        io.emit("gameState", gameState);
    }
}

function checkForEndOfGame() {
    // Check for a win
    gameState.players.forEach((player) => {
        winPatterns.forEach((seq) => {
            if (
                gameState.board[seq[0]] == player &&
                gameState.board[seq[1]] == player &&
                gameState.board[seq[2]] == player
            ) {
                gameState.result.status = Statuses.WIN;
                gameState.result.winner = player;
            }
        });
    });

    // Check for a draw
    if (gameState.result.status != Statuses.WIN) {
        const emptyBlock = gameState.board.indexOf(null);
        if (emptyBlock == -1) {
            gameState.result.status = Statuses.DRAW;
            return true;
        }
    }
    else {
        return true;
    }

    return false;
}

function startTurnTimer() {
    let secondsLeft = 16;

    turnTimer = setInterval(() => {
        secondsLeft--;
        io.emit('turnTimer', secondsLeft);

        if (secondsLeft <= 0) {
            console.log("timeOut");

            handleTurnTimeout();
            secondsLeft = 15;
        }

    }, 1000);
}

function handleTurnTimeout() {
    const randomEmptyIndex = getRandomEmptyIndex(gameState.board);

    if (randomEmptyIndex !== -1) {
        const currentPlayer = gameState.currentPlayer;
        gameState.board[randomEmptyIndex] = currentPlayer;
    }

    clearInterval(turnTimer);
    if (!checkForEndOfGame()) {
        startTurnTimer();
        switchPlayer();
    } else {
        io.emit("gameState", gameState);
    }
}


function switchPlayer() {
    gameState.currentPlayer = gameState.players.find(
        (p) => p !== gameState.currentPlayer
    );

    io.emit("gameState", gameState);
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

server.listen(3000, () => {
    console.log('listening on *:3000');
});