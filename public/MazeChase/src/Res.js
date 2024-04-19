// Lista re recursos a precargar 
let images = {
    background1 : "res/map1/background.png",
    c_tile1 : "res/map1/c_tile.png",
    c_tile1b : "res/map1/c_tile_b.png",
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
    c_tile2b : "res/map2/c_tile_b.png",
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
    background3 : "res/map3/background.png",
    c_tile3 : "res/map3/c_tile.png",
    c_tile3b : "res/map3/c_tile_b.png",
    itl_tile3 : "res/map3/itl_tile.png",
    itr_tile3 : "res/map3/itr_tile.png",
    ibr_tile3 : "res/map3/ibr_tile.png",
    ibl_tile3 : "res/map3/ibl_tile.png",
    t_tile3 : "res/map3/t_tile.png",
    r_tile3 : "res/map3/r_tile.png",
    b_tile3 : "res/map3/b_tile.png",
    l_tile3 : "res/map3/l_tile.png",
    tl_tile3 : "res/map3/tl_tile.png",
    tr_tile3 : "res/map3/tr_tile.png",
    br_tile3 : "res/map3/br_tile.png",
    bl_tile3 : "res/map3/bl_tile.png",
    player : "res/player.png",
    head_u_p1 : "res/head_u_p1.png",
    head_r_p1 : "res/head_r_p1.png",
    head_d_p1 : "res/head_d_p1.png",
    head_l_p1 : "res/head_l_p1.png",
    tail_u_p1 : "res/tail_u_p1.png",
    tail_r_p1 : "res/tail_r_p1.png",
    tail_d_p1 : "res/tail_d_p1.png",
    tail_l_p1 : "res/tail_l_p1.png",
    head_u_p2 : "res/head_u_p2.png",
    head_r_p2 : "res/head_r_p2.png",
    head_d_p2 : "res/head_d_p2.png",
    head_l_p2 : "res/head_l_p2.png",
    tail_u_p2 : "res/tail_u_p2.png",
    tail_r_p2 : "res/tail_r_p2.png",
    tail_d_p2 : "res/tail_d_p2.png",
    tail_l_p2 : "res/tail_l_p2.png",
    cooldown : "res/cooldown.png",
    ice_skill : "res/ice_skill.png",
    ice_particles : "res/ice_particles.png",
    ice_effect : "res/ice_effect.png",
    speed_skill : "res/speed_skill.png",
    dash_particles : "res/dash_particles.png",
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
