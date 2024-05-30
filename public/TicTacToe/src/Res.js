const soundEffects = {
  win: "../common/res/win.mp3",
  loss: "../common/res/loss.mp3",
  draw: "../common/res/draw.mp3",
  beep: "../common/res/beep.wav",
  wood_sound: "res/wood_sound.mp3"
}

const cache = {};
// Lista re recursos a precargar
let images = {
  lobby_background: "../common/res/lobby_background.png",
  ready_symbol: "../common/res/ready_symbol.png",
  waiting_symbol: "../common/res/waiting_symbol.png",
  ready_button: "../common/res/ready_button.png",
  ready_button_pressed: "../common/res/ready_button_pressed.png",
  screenshot: "res/lobby/screenshot.png",
  controls: "res/lobby/controls.png",
  explanation: "res/lobby/explanation.png",
  results_background: "../common/res/results_background.png",
  play_button: "../common/res/play_button.png",
  play_button_pressed: "../common/res/play_button_pressed.png",
  back_button: "../common/res/back_button.png",
  back_button_pressed: "../common/res/back_button_pressed.png",
  tttButton: "res/empty.png",
  board: "res/board.png",
  X: "res/X.png",
  O: "res/O.png",
  turnIndicator: "res/turn_indicator.png",
};

let imageRoutes = Object.values(images);
let allImagesLoaded = false;

loadImages(0);

function loadImages(index) {
  if (index >= imageRoutes.length) {
    if (!allImagesLoaded) {
      allImagesLoaded = true;
      startGame();
    }
    return;
  }

  const img = new Image();
  img.src = imageRoutes[index];
  img.onload = function () {
    cache[imageRoutes[index]] = img;
    loadImages(index + 1);
  };
  img.onerror = function () {
    console.error(`Error loading image: ${imageRoutes[index]}`);
    loadImages(index + 1);
  };
}
