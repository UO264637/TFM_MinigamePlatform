// Lista re recursos a precargar
const images = {
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
