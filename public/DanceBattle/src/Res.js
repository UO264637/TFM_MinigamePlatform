const soundEffects = {
  beep: "../common/res/beep.wav",
}

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
  wheel: "res/wheel.png",
  wheel_u: "res/wheel_u.png",
  wheel_r: "res/wheel_r.png",
  wheel_d: "res/wheel_d.png",
  wheel_l: "res/wheel_l.png",
  wheel_m: "res/wheel_m.png",
  player_back: "res/player_back.png",
  player_back_idle: "res/player_back_idle.png",
  player_back_up: "res/player_back_up.png",
  player_back_right: "res/player_back_right.png",
  player_back_down: "res/player_back_down.png",
  player_back_left: "res/player_back_left.png",
  player_back_space: "res/player_back_space.png",
  player_front: "res/player_front.png",
  player_front_idle: "res/player_front_idle.png",
  player_front_up: "res/player_front_up.png",
  player_front_right: "res/player_front_right.png",
  player_front_down: "res/player_front_down.png",
  player_front_left: "res/player_front_left.png",
  player_front_space: "res/player_front_space.png",
  background: "res/background.png",
  up: "res/up.png",
  right: "res/right.png",
  down: "res/down.png",
  left: "res/left.png",
  space: "res/space.png",
  wrong: "res/wrong.png",
  placeholder3: "res/placeholder3.png",
  placeholder5: "res/placeholder5.png",
  placeholder7: "res/placeholder7.png",
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
