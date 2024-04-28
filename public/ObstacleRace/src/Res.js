// Lista re recursos a precargar
const images = {
  lobby_background: "../common/res/lobby_background.png",
  ready_symbol: "../common/res/ready_symbol.png",
  waiting_symbol: "../common/res/waiting_symbol.png",
  ready_button: "../common/res/ready_button.png",
  screenshot: "res/lobby/screenshot.png",
  controls: "res/lobby/controls.png",
  explanation: "res/lobby/explanation.png",
  results_background: "../common/res/results_background.png",
  play_button: "../common/res/play_button.png",
  back_button: "../common/res/back_button.png",
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

const imageRutes = Object.values(images);

loadImages(0);

function loadImages(index) {
  let image = new Image();
  image.src = imageRutes[index];
  image.onload = function () {
    if (index < imageRutes.length - 1) {
      index++;
      loadImages(index);
    } else {
      startGame();
    }
  };
}
