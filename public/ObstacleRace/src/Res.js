// Lista re recursos a precargar 
const images = {
    background0 : "res/background.png",
    background1 : "res/background1.png",
    background2 : "res/background2.png",
    background3 : "res/background3.png",
    background4 : "res/background4.png",
    background5 : "res/background5.png",
    floorObstacle : "res/floorObstacle1.png",
    airObstacle : "res/floorObstacle1.png",
    player : "res/player.png",
    idle_player: "res/idle_player.png",
    obstacle_indicator: "res/obstacle_indicator.png",
    running_player: "res/running_player.png",
    floor: "res/floor.png",
    floor_background: "res/floor_background.png",
};

const imageRutes = Object.values(images);

loadImages(0);

function loadImages(index){
    let image = new Image();
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
