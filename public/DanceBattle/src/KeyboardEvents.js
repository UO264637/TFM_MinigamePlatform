const keysPressed = [];

window.addEventListener('keydown', onKeyDown, false);

function onKeyDown( event) {
    let position = keysPressed.indexOf(event.code);
    if ( position == -1 ) {
        keysPressed.push(event.code);
    }

}