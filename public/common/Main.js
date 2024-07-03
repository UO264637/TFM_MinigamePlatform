// Canvas y contexto del Canvas
const canvas = document.getElementById("canvas");
const header = document.getElementsByTagName("header")[0];
const context = canvas.getContext("2d");
let minScale = 1;

// Capas
let layer;
let lobbyLayer;
let gameLayer;
let resultsLayer;

// Controles
const controls = {};

// Socket.io
const socket = io(baseUrl, {
  transports: ["websocket"],
  withCredentials: true,
});

let socketId;

socket.on("connect", function () {
  socketId = socket.id;
});

// Inicio capas y bucle del juego
function startGame() {
  gameLayer = new GameLayer();
  lobbyLayer = new LobbyLayer();
  resultsLayer = new ResultsLayer();
  layer = lobbyLayer;

  initWebSocket();
  setInterval(loop, 1000 / 30);
}

function loop() {
  console.log("loop - ");

  layer.update();
  layer.calculateTaps(taps);
  layer.processControls();
  layer.paint();

  updateTaps();
}

function updateTaps() {
  for (const tap of taps) {
    if (tap.type == tapType.start) {
      tap.type = tapType.mantain;
    }
  }
}

// Cambio de escalado
window.addEventListener("load", resize, false);
window.addEventListener("resize", resize, false);
const gameStatus = document.getElementById('game-status');

function resize() {
  const headerHeight = header.offsetHeight;

  let widthScaling = parseFloat(window.innerWidth / originalCanvasWidth);
  let heightScaling = parseFloat((window.innerHeight - headerHeight) / originalCanvasHeight);
  let minScale = Math.min(widthScaling, heightScaling);

  header.style.width = `${originalCanvasWidth * minScale}px`;

  canvas.style.width = `${originalCanvasWidth * minScale}px`;
  canvas.style.height = `${originalCanvasHeight * minScale}px`;

  gameStatus.style.width = `${originalCanvasWidth * minScale}px`;
  gameStatus.style.height = `${originalCanvasHeight * minScale}px`;
  gameStatus.style.top = `${headerHeight}px`;
}
 
function initWebSocket() {
  const urlParams = new URLSearchParams(window.location.search);
  const playerName = urlParams.get("playerName");
  const roomId = urlParams.get("roomId");
  const pathParts = window.location.pathname.split("/");
  const gameType = pathParts[pathParts.length - 2];

  socket.emit("joinGame", {
    playerName: playerName,
    roomId: roomId,
  });

  socket.on("gameStart", function (state) {
    gameLayer.start(state);
    layer = gameLayer;
    resultsLayer.updated = false;
  });

  socket.on("gameState", function (state) {
    layer.updateGameState(state);
  });

  socket.on("turnTimer", function (secondsLeft) {
    gameLayer.updateTurnTimer(secondsLeft);
  });

  socket.on("gameFinished", function (state) {
    gameLayer.finish(state);
    layer = resultsLayer;
  });

  socket.on("error", function (message) {
    if (message.error == "FULL") {
      window.location.href = "../index.html";
      alert("La sala está llena");
    } else {
      fetch(baseUrl + "/api/createRoom", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameType: gameType }),
      })
        .then((response) => response.json())
        .then((data) => {
          window.location.href = `./index.html?roomId=${data.roomId}&playerName=${playerName}`;
        })
        .catch((error) => console.error("Error creating new room:", error));
    }
  });
}
