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
  engine: "res/floor_background.png",
  car: "res/car.png",
  caboose: "res/floor_background.png",
  passenger1: "res/player.png",
  passenger2: "res/air_obstacle1.png",
  passenger3: "res/floor_obstacle1.png",
  count_input: "res/player.png"
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
