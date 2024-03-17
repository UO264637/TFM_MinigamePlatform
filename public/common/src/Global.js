var taps = []; // actuales registradas

var tapType = {}; // tipos
tapType.start = 1;
tapType.mantain = 2;

const Statuses = {
  WAITING: "waiting",
  PLAYING: "playing",
  DRAW: "draw",
  WIN: "win",
};

const PlayerStatuses = {
  IDLE: 1,
  MOVING: 2,
  HIT: 3,
  CROUCHED: 4,
  JUMPIN: 5,
};


var baseUrl = "http://localhost:3000";

var originalCanvasWidth = 1280;
var originalCanvasHeight = 720;
