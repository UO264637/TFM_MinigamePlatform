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

var socketUrl = "http://localhost:3000";
