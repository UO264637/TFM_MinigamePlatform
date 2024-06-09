const express = require("express");
const http = require("http");
const cors = require("cors");

const roomManager = require("./RoomManager");
const TicTacToe = require("./games/TicTacToe");
const ObstacleRace = require("./games/ObstacleRace");
const DanceBattle = require("./games/DanceBattle");
const MazeChase = require("./games/MazeChase");
const CabooseCount = require("./games/CabooseCount");

const app = express();
app.use(cors());
app.use("/api/waitingRooms", cors());
app.use(express.json());
app.use(express.static("public"));

const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://tfm-minigame-platform.vercel.app",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const games = {
  TicTacToe: new TicTacToe(io),
  ObstacleRace: new ObstacleRace(io),
  DanceBattle: new DanceBattle(io),
  MazeChase: new MazeChase(io),
  CabooseCount: new CabooseCount(io),
};

app.get("/api/gameTypes", (req, res) => {
  const gameTypes = Object.keys(games);

  res.json(gameTypes);
});

app.get("/api/waitingRooms", (req, res) => {
  const waitingRooms = roomManager.getWaitingRooms();

  res.json(waitingRooms);
});

app.post("/api/createRoom", (req, res) => {
  const { gameType } = req.body;

  if (!gameType || !games[gameType]) {
    return res.status(400).json({ error: "gameType is not valid" });
  }
  const roomId = roomManager.createRoom(gameType);
  const room = roomManager.getRoom(roomId);

  room.game = games[gameType];
  room.game.initializeGameState(room);

  res.json({ roomId: roomId });
});

io.on("connection", function (socket) {
  socket.on("joinGame", function (data) {
    joinGame(socket.id, data);
  });

  socket.on("ready", function () {
    readyPlayer(socket.id);
  });

  socket.on("action", function (data) {
    action(socket.id, data);
  });

  socket.on("disconnect", function () {
    disconnect(socket.id);
  });

  socket.on("playAgain", function () {
    playAgain(socket.id);
  });
});

function joinGame(socketId, data) {
  let room = roomManager.getRoom(data.roomId);

  if (room != null) {
    room.game.handleJoinGame(room, socketId, data);
  } else {
    io.to(socketId).emit("error", { message: "Room does not exist", error: "NULL" });
  }
}

function readyPlayer(socketId) {
  let room = roomManager.getRoomBySocketId(socketId);

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
  const room = roomManager.getRoomBySocketId(socketId);
  const roomId = roomManager.getRoomId(socketId);

  if (room?.game != null) {
    room.game.handleDisconnect(room, socketId);
  }

  if (room?.state.players.length == 0) {
    setTimeout(() => {
      if (room?.state.players.length == 0) {
        roomManager.deleteRoom(roomId);
      }
    }, 1000);
  }
}

function playAgain(socketId) {
  let room = roomManager.getRoomBySocketId(socketId);

  if (room != null) {
    room.game.handlePlayAgain(room, socketId);
  }
  else {
    io.to(socketId).emit("gameRestart");
  }
}

server.listen(3000, () => {
  console.log("listening on *:3000");
});
