// Lista re recursos a precargar 
let images = {
    background1 : "res/map1/background.png",
    c_tile1 : "res/map1/c_tile.png",
    itl_tile1 : "res/map1/itl_tile.png",
    itr_tile1 : "res/map1/itr_tile.png",
    ibr_tile1 : "res/map1/ibr_tile.png",
    ibl_tile1 : "res/map1/ibl_tile.png",
    t_tile1 : "res/map1/t_tile.png",
    r_tile1 : "res/map1/r_tile.png",
    b_tile1 : "res/map1/b_tile.png",
    l_tile1 : "res/map1/l_tile.png",
    tl_tile1 : "res/map1/tl_tile.png",
    tr_tile1 : "res/map1/tr_tile.png",
    br_tile1 : "res/map1/br_tile.png",
    bl_tile1 : "res/map1/bl_tile.png",
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
    head_u : "res/head_u.png",
    head_r : "res/head_r.png",
    head_d : "res/head_d.png",
    head_l : "res/head_l.png",
    tail_u : "res/tail_u.png",
    tail_r : "res/tail_r.png",
    tail_d : "res/tail_d.png",
    tail_l : "res/tail_l.png",
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
