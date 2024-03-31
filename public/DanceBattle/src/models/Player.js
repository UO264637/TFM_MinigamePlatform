class Player extends Model {

    constructor(x, y, name, position) {
        super(images["player_"+position], x, y);
        this.state = PlayerStatuses.IDLE;

        // Animaciones
        // this.idleAnim = new Animation(images.idle_player,
        //     this.width, this.height, 6, 4);

        this.rightAnim = new Animation(images["player_"+position+"_idle"],
            this.width, this.height, 4, 4);

        // this.crouchingAnim = new Animation(images.crouching_player,
        //     this.width, this.height, 3, 4);

        // this.jumpingAnim = new Animation(images.jumping_player,
        //     this.width, this.height, 3, 4);

        // this.hitAnim = new Animation(images.hit_player,
        //     this.width, this.height, 3, 4, this.endHitAnim.bind(this));

        // this.animation = this.idleAnim;
        this.animation = this.rightAnim;

        this.tag = new CenteredText(
            name,
            "#FFFFFF",
            x,
            y-this.height/2 - 15
          );


    }

    update() {
        this.animation.update();

        /*switch (this.state) {
            case PlayerStatuses.IDLE:
                this.animation = this.idleAnim;
                break;
            case PlayerStatuses.MOVING:
                this.animation = this.runningAnim;
                break;
            case PlayerStatuses.CROUCHED:
                this.animation = this.crouchingAnim;
                break;
            case PlayerStatuses.HIT:
                this.animation = this.hitAnim;
                break;
            case PlayerStatuses.JUMPING:
                this.animation = this.jumpingAnim;
                break;
        }
        */
    }

    paint() {
        //super.paint();
        this.animation.paint(this.x, this.y);
        this.tag.paint();
    }
}
