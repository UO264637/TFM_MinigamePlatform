// Lista re recursos a precargar 
let images = {
    tttButton : "res/empty.png",
    background : "res/background.png",
    X : "res/X.png",
    O : "res/O.png",
    turnIndicator: "res/turn_indicator.png",
    c_tile : "res/c_tile.png",
    itl_tile : "res/itl_tile.png",
    itr_tile : "res/itr_tile.png",
    ibr_tile : "res/ibr_tile.png",
    ibl_tile : "res/ibl_tile.png",
    t_tile : "res/t_tile.png",
    r_tile : "res/r_tile.png",
    b_tile : "res/b_tile.png",
    l_tile : "res/l_tile.png",
    tl_tile : "res/tl_tile.png",
    tr_tile : "res/tr_tile.png",
    br_tile : "res/br_tile.png",
    bl_tile : "res/bl_tile.png",
    player : "res/player.png",
};

let imageRutes = Object.values(images);

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
