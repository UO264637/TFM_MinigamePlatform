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
    let nPlayers = room.state.players.length;

    const newPlayer = {
        playerName: data.playerName,
        id: socketId
    };

    if (nPlayers === 0) {
        console.log('Room ' + data.roomId +" (1/2): "+ data.playerName + " joined");

        room.state.players.push(newPlayer);
        updateGameState(data.roomId)
    }
    else if (nPlayers === 1){
        console.log('Room ' + data.roomId +" (2/2): "+ data.playerName + " joined");

        room.state.players.push(newPlayer);

        room.game.handleGameStart(room);
        updateGameState(data.roomId)
    }

}

function action(socketId, data) {
    const roomId = roomManager.getRoomId(socketId);

    if (roomId != -1) {
        const room = roomManager.getRoom(roomId);
        room.game.handleAction(room, socketId, data);
    }

    updateGameState(roomId)
}

function disconnect(socketId) {
    console.log('Client disconnected:', socketId);
    
    const roomId = roomManager.getRoomId(socketId);
    if (roomId != -1) {
        const room = roomManager.getRoom(roomId);

        room.game.handleDisconnect(room, socketId);
        updateGameState(roomId);        
    }
}

function updateGameState(roomId) {
    const room = roomManager.getRoom(roomId);

    for (const player of room.state.players) {
        io.to(player.id).emit('gameState', room.state);
    }
}

server.listen(3000, () => {
    console.log('listening on *:3000');
});