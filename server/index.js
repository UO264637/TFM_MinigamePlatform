const express = require('express')
const http = require('http');
const cors = require('cors');

const app = express();
app.use(cors());
app.use('/api/waitingRooms', cors());
app.use(express.json());

const server = http.createServer(app);

const io = require("socket.io")(server, {
    cors: {
        origin: ["http://localhost:3000", "https://tfm-minigame-platform.vercel.app"],
        methods: ["GET", "POST"],
        credentials: true,
    }
});

const roomManager = require('./RoomManager');
const TicTacToe = require('./games/TicTacToe');
const ObstacleRace = require('./games/ObstacleRace');

const games = {
    "TicTacToe": new TicTacToe(io),
    "ObstacleRace": new ObstacleRace(io),
}

app.get('/api/gameTypes', (req, res) => {
    const gameTypes = Object.keys(games);

    res.json(gameTypes);
});

app.get('/api/waitingRooms', (req, res) => {
    const waitingRooms = roomManager.getWaitingRooms();

    res.json(waitingRooms);
});

app.post('/api/createRoom', (req, res) => {
    const { gameType } = req.body;

    if (!gameType || !games[gameType]) {
        return res.status(400).json({ error: 'gameType is not valid' });
    }
    const roomId = roomManager.createRoom(gameType);
    const room = roomManager.getRoom(roomId);

    room.game = games[gameType];
    room.game.initializeGameState(room);

    res.json({ roomId: roomId });
});

io.on('connection', function (socket) {
    console.log('Client connected:', socket.id);

    socket.on("joinGame", function (data) {
        joinGame(socket.id, data);
    });

    socket.on("readyPlayer", function (data) {
         readyPlayer(socket.id, data);
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

function readyPlayer(socketId, data) {
    let room = roomManager.getRoom(data.roomId);

    if (room != null) {
        room.game.handleReadyPlayer(room, socketId);
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

    if (room?.game != null) {
        room.game.handleDisconnect(room, socketId);
    }
}

server.listen(3000, () => {
    console.log('listening on *:3000');
});