class Player extends Model {

    constructor(x, y) {
        super(images.player, x, y)
        this.state = PlayerStatuses.IDLE;

        this.vx = 0; // velocidadX
        this.vy = 0; // velocidadY

        // Animaciones
        this.idleA = new Animationn(images.idle_player,
            this.width, this.height, 6, 4);

        this.runningA = new Animationn(images.running_player,
            this.width, this.height, 6, 4);

        this.animation = this.idleA;

    }

    update() {
        this.animation.update();

        switch (this.estado) {
            case PlayerStatuses.IDLE:
                this.animation = this.idleA;
                break;
            case PlayerStatuses.MOVING:
                this.animation = this.runningA;
                break;
        }

        this.x = this.x + this.vx;
        this.y = this.y + this.vy;
    }

    paint() {
        this.animation.paint(this.x, this.y);
    }

    moveX(direction) {
        this.vx = direction * 3;
    }

    moveY(direction) {
        this.vy = direction * 3;
    }

}
