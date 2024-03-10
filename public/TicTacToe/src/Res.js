// Lista re recursos a precargar 
var images = {
    tttButton : "res/empty.png",
    board : "res/board.png",
    X : "res/X.png",
    O : "res/O.png",
    turnIndicator: "res/turn_indicator.png"
};

var imageRutes = Object.values(images);

loadImages(0);

function loadImages(index){
    var image = new Image();
    image.src = imageRutes[index];
    image.onload = function(){
        if ( index < imageRutes.length-1 ){
            index++;
            loadImages(index);
        } else {
            startGame();
        }
    }
}
