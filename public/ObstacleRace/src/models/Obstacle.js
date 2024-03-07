class Obstacle extends Model {

    constructor(x, y) {
        super(images.obstacle, x, y)

        this.yv = 0;
        this.xv = 0;
    }

    update (){
        this.x += this.xv
    }

}
