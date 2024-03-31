// Lista re recursos a precargar 
var images = {
    wheel : "res/wheel.png",
    wheel_d : "res/wheel_d.png",
    wheel_l : "res/wheel_l.png",
    wheel_u : "res/wheel_u.png",
    wheel_r : "res/wheel_r.png",
    wheel_m : "res/wheel_m.png",
    player_back: "res/player_back.png",
    player_back_idle: "res/player_back_idle.png",
    player_back_right: "res/player_back_right.png",
    player_front: "res/player_front.png",
    player_front_right: "res/player_front_right.png",
    player_front_idle: "res/player_front_idle.png",
    background : "res/background.png",
    right : "res/right.png"
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
