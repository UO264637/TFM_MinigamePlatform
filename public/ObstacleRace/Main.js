// Canvas y contexto del Canvas
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var minScale = 1;

// Capas
var gameLayer;

// Controles
var controls = {};
const socket = io("http://localhost:3000", {
  transports: ["websocket"],
});

// Inicio capas y bucle del juego
function startGame() {
    //initWebSocket();
    gameLayer = new GameLayer();

/*     socket.on("gameState", function (state) {
        gameLayer.updateGameState(state);
    });
 */
    setInterval(loop, 1000 / 30);
}

function loop() {
    console.log("loop - ")
    gameLayer.update();
    gameLayer.calculateTaps(taps);
    gameLayer.processControls();
    gameLayer.paint();

    updateTaps();
}

function updateTaps() {
    for (var i = 0; i < taps.length; i++) {
        if (taps[i].type == tapType.start) {
            taps[i].type = tapType.mantain;
        }
    }
}

// Cambio de escalado
window.addEventListener('load', resize, false);
window.addEventListener('resize', resize, false);

function resize() {
    canvas.width = originalCanvasWidth;
    canvas.height = originalCanvasHeight;

    var widthScaling = parseFloat(window.innerWidth / canvas.width);
    var heightScaling = parseFloat(window.innerHeight / canvas.height);

    minScale = Math.min(widthScaling, heightScaling);

    canvas.width *= minScale;
    canvas.height *= minScale;

    context.scale(minScale, minScale);
}

function initWebSocket() {
    const urlParams = new URLSearchParams(window.location.search);
    const playerName = urlParams.get('playerName');
    const roomId = urlParams.get('roomId');

    socket.emit("joinGame", {
        playerName: playerName,
        roomId: roomId,
    });
}