// Lista re recursos a precargar 
var images = {
    wheel : "res/wheel.png",
    wheel_d : "res/wheel_d.png",
    wheel_l : "res/wheel_l.png",
    wheel_u : "res/wheel_u.png",
    wheel_r : "res/wheel_r.png",
    wheel_m : "res/wheel_m.png",

    background : "res/background.png",
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
