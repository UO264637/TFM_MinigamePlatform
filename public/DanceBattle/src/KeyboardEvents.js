const keysPressed = [];

window.addEventListener("keydown", onKeyDown, false);

function onKeyDown(event) {
  let position = keysPressed.indexOf(event.code);
  if (position == -1) {
    keysPressed.push(event.code);
  }

  if (event.code == 82) {
    controls.ready = true;
  }
}

function disableKeyboardInput() {
  window.removeEventListener("keydown", onKeyDown);
}

function enableKeyboardInput() {
  window.addEventListener("keydown", onKeyDown);
}
