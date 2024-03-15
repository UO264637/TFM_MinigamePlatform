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
            this.width, this.height, 3, 4);

        let image = new Image();
        image.src = images.crouching_player;

        this.crouchingA = new Animation(images.crouching_player,
            this.width, image.height, 3, 4);

        this.animation = this.idleA;

    }

    update() {
        this.animation.update();

        if (this.hitsBottom) {
            this.inTheAir = false;
        } else {
            this.inTheAir = true;
        }


        switch (this.state) {
            case PlayerStatuses.IDLE:
                this.animation = this.idleA;
                break;
            case PlayerStatuses.MOVING:
                this.animation = this.runningA;
                break;
            case PlayerStatuses.CROUCHED:
                this.animation = this.crouchingA;
                break;
        }
    }

    paint() {
        this.animation.paint(this.x, this.y);
    }

    run() {
        this.state = PlayerStatuses.MOVING;
    }

    stop() {
        this.state = PlayerStatuses.IDLE;
    }

    jump() {
        if (!this.inTheAir) {
            this.yv = -24;
            this.inTheAir = true;
        }
    }

    crouch() {
        if (!this.inTheAir) {
            this.state = PlayerStatuses.CROUCHED
        }

    }

    collidesCircle(model) {
        if (this.state != PlayerStatuses.CROUCHED) {
            console .log("a")
            return super.collidesCircle(model);
        }
        else {
            let collides = false;
            

            if (model.x - model.width / 2 <= this.x + this.width / 2
                && model.x + model.width / 2 >= this.x - this.width / 2
                && this.y + (this.height - 90)/ 2 >= model.y - model.height / 2
                && this.y - (this.height - 90) / 2 <= model.y + model.height / 2) {

                    console.log(this.y - (this.height + 90));
                    console.log(model.y + model.height / 2)
                collides = true;

            }
            return collides;
        }
    }
}
