class Obstacle extends Model {

    constructor(x, y) {
        super(images.obstacle, x, y)

        this.yv = 0;
        this.xv = 1;
    }

    update (){
        this.xv = -1;
        this.x = this.x + this.xv;
    }

}
