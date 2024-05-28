const soundEffects = {
  beep: "../common/res/beep.wav",
  jump: "res/jump.mp3",
  hit: "res/hit.mp3",
  crouch: "res/crouch.wav"
}

const cache = {}
// Lista re recursos a precargar
const images = {
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
  background0: "res/background.png",
  background1: "res/background1.png",
  background2: "res/background2.png",
  background3: "res/background3.png",
  background4: "res/background4.png",
  background5: "res/background5.png",
  floor: "res/floor.png",
  floor_background: "res/floor_background.png",
  floor_obstacle1_anim: "res/floor_obstacle1_anim.png",
  floor_obstacle1: "res/floor_obstacle1.png",
  air_obstacle1_anim: "res/air_obstacle1_anim.png",
  air_obstacle1: "res/air_obstacle1.png",
  obstacle_indicator: "res/obstacle_indicator.png",
  progressbar: "res/progressbar.png",
  progress_indicator1: "res/progress_indicator1.png",
  progress_indicator2: "res/progress_indicator2.png",
  flag: "res/flag.png",
  player: "res/player.png",
  idle_player: "res/idle_player.png",
  running_player: "res/running_player.png",
  crouching_player: "res/crouching_player.png",
  hit_player: "res/hit_player.png",
  jumping_player: "res/jumping_player.png",
  goal: "res/goal.png",
  goal_anim: "res/goal_anim.png",
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
