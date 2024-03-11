class Obstacle extends Model {

    constructor(image, x, y) {
        super(image, x, y)

        this.yv = 0;
        this.xv = 0;
    }

    update (){
        this.x += this.xv
    }

}
