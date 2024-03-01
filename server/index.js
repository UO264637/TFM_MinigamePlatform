var express = require('express')
var http = require('http');

var app = express();
const cors = require('cors');
app.use(cors());
var server = http.createServer(app);

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const roomManager = require('./RoomManager');
const TicTacToe = require('./games/TicTacToe');

games = {
    "TICTACTOE": new TicTacToe(io)
}

app.get('/api/waitingRooms', (req, res) => {
    const waitingRooms = roomManager.getWaitingRooms();

    res.json(waitingRooms);
});

app.post('/api/createRoom', (req, res) => {
    const roomId = roomManager.createRoom("TICTACTOE");
    const room = roomManager.getRoom(roomId);

    room.game = games["TICTACTOE"];
    room.game.initializeGameState(room);

    res.json({ roomId: roomId });
});

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
    let room = roomManager.getRoom(data.roomId);

    if (room != null) {
        room.game.handleJoinGame(room, socketId, data);
    }
}

function action(socketId, data) {
    const room = roomManager.getRoomBySocketId(socketId);

    if (room != null) {
        room.game.handleAction(room, socketId, data);
    }
}

function disconnect(socketId) {
    console.log('Client disconnected:', socketId);
    const room = roomManager.getRoomBySocketId(socketId);

    if (room != null && room.game != null) {
        room.game.handleDisconnect(room, socketId);      
    }
}

server.listen(3000, () => {
    console.log('listening on *:3000');
});