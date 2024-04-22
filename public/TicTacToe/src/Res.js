// Lista re recursos a precargar
let images = {
  lobby_background: "../common/res/lobby_background.png",
  ready_button: "../common/res/ready_button.png",
  tttButton: "res/empty.png",
  board: "res/board.png",
  X: "res/X.png",
  O: "res/O.png",
  turnIndicator: "res/turn_indicator.png",
};

let imageRutes = Object.values(images);

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
