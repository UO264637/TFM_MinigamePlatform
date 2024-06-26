const keys = [];

window.addEventListener("keydown", onKeyDown, false);
window.addEventListener("keyup", onKeyUp, false);

function onKeyDown(event) {
  // agregar la tecla pulsada si no estaba
  let position = keys.indexOf(event.keyCode);
  if (position == -1) {
    keys.push(event.keyCode);
    switch (event.keyCode) {
      case 32:
        controls.action = true;
        break;
      case 38:
        controls.moveY = 1;
        break;
      case 40:
        controls.moveY = -1;
        break;
      case 39:
        controls.moveX = 1;
        break;
      case 37:
        controls.moveX = -1;
        break;
      case 82:
        controls.ready = true;
        break;
    }
  }
}

function onKeyUp(event) {
  // sacar la tecla pulsada
  let position = keys.indexOf(event.keyCode);
  keys.splice(position, 1);

  switch (event.keyCode) {
    case 32:
      controls.action = false;
      break;
    case 38:
      if (controls.moveY == 1) {
        controls.moveY = 0;
      }
      break;
    case 40:
      if (controls.moveY == -1) {
        controls.moveY = 0;
      }
      break;
    case 39:
      if (controls.moveX == 1) {
        controls.moveX = 0;
      }
      break;
    case 37:
      if (controls.moveX == -1) {
        controls.moveX = 0;
      }
      break;
    case 82:
      controls.ready = false;
      break;
  }
}

function disableKeyboardInput() {
  window.removeEventListener("keydown", onKeyDown);
  window.removeEventListener("keyup", onKeyUp);
}

function enableKeyboardInput() {
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
}
