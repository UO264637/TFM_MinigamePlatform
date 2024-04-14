// Lista re recursos a precargar 
let images = {
    background : "res/background.png",
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
    background2 : "res/map2/background.png",
    c_tile2 : "res/map2/c_tile.png",
    itl_tile2 : "res/map2/itl_tile.png",
    itr_tile2 : "res/map2/itr_tile.png",
    ibr_tile2 : "res/map2/ibr_tile.png",
    ibl_tile2 : "res/map2/ibl_tile.png",
    t_tile2 : "res/map2/t_tile.png",
    r_tile2 : "res/map2/r_tile.png",
    b_tile2 : "res/map2/b_tile.png",
    l_tile2 : "res/map2/l_tile.png",
    tl_tile2 : "res/map2/tl_tile.png",
    tr_tile2 : "res/map2/tr_tile.png",
    br_tile2 : "res/map2/br_tile.png",
    bl_tile2 : "res/map2/bl_tile.png",
    player : "res/player.png",
    player_visual : "res/player_visual.png",
    tail : "res/tail.png",
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
