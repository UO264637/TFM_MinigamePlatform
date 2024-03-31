class MovementsWheel extends Model {

    constructor(x, y) {
        super(images.wheel, x, y);
    }

    update() { 
        if (!this.timer) {
            this.timer = setTimeout(() => {
                if (this.image.src != images.wheel) {
                    this.image.src = images.wheel;
                }
                this.timer = null;
            }, 100); // 500 milisegundos = medio segundo
        }
    }

    down() {
        this.image.src = images.wheel_d;
    }

    right() {
        this.image.src = images.wheel_r;
    }

    up() {
        this.image.src = images.wheel_u;
    }

    left() {
        this.image.src = images.wheel_l;

    }

    middle() {
        this.image.src = images.wheel_m;
    }

    clear() {
        this.image.src = images.wheel;
    }
}