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
  background: "res/background.png",
  engine: "res/engine.png",
  car: "res/car.png",
  car_bg: "res/car_bg.png",
  caboose: "res/caboose.png",
  passenger1: "res/player.png",
  passenger2: "res/air_obstacle1.png",
  passenger3: "res/floor_obstacle1.png",
  count_input: "res/counter.png",
  counter_up: "res/counter_up.png",
  counter_down: "res/counter_down.png",
  player_back: "res/player_back.png"
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
