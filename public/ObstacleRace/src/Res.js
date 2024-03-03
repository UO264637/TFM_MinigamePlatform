// Lista re recursos a precargar 
var images = {
    background : "res/background.png",
    player : "res/player.png",
    obstacle : "res/obstacle.png",
    idle_player: "res/idle_player.png",
    running_player: "res/running_player.png",
    floor: "res/floor.png",
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
