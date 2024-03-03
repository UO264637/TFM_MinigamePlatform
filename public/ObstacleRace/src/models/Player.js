class Player extends Model {

    constructor(x, y) {
        super(images.player, x, y)
        this.state = PlayerStatuses.IDLE;

        this.xv = 0; // velocidadX
        this.yv = 0; // velocidadY

        // Animaciones
        this.idleA = new Animation(images.idle_player,
            this.width, this.height, 6, 4);

        this.runningA = new Animation(images.running_player,
            this.width, this.height, 6, 4);

        this.animation = this.idleA;

    }

    update() {
        this.animation.update();

        if (this.hitsBottom == true){
            this.inTheAir = false;
        } else {
            this.inTheAir = true;
        }
    

        switch (this.estado) {
            case PlayerStatuses.IDLE:
                this.animation = this.idleA;
                break;
            case PlayerStatuses.MOVING:
                this.animation = this.runningA;
                break;
        }
    }

    paint() {
        this.animation.paint(this.x, this.y);
    }

    moveX(direction) {
        this.xv = direction * 3;
    }

    moveY(direction) {
        this.yv = direction * 3;
    }

    jump(){
        if ( !this.inTheAir ) {
            this.yv = -16;
            this.inTheAir = true;
        }
    
    }
    
}
