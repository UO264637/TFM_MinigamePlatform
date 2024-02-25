class Button extends Model {

    constructor(imageRoute, x, y) {
        super(imageRoute, x, y)
        this.pressed = false;
    }

    containsPoint(pX, pY){
        if ( pY >= this.y - this.height/2 &&
            pY <= this.y + this.height/2 &&
            pX <= this.x + this.width/2 &&
            pX >= this.x - this.width/2){
            return true;
        }
        return false;
    }

}
