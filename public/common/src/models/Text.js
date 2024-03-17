class Text {

    constructor(value, color, x, y) {
        this.value = value;
        this.color = color;
        this.x = x;
        this.y = y;
        this.width = 0; 
        this.size = 24; 
    }

    paint(){
        context.font = this.size + "px RetroGaming";
        context.fillStyle = this.color;
        context.textAlign = "left";
        context.fillText(this.value,this.x,this.y);

        this.width = context.measureText(this.value).width + this.size/2;
    }

    collides(text) {
        let collides = false;

        if (this.x - this.width/2 <= text.x + text.width/2 &&
            this.x + this.width/2 >= text.x - text.width/2 &&
            this.y + this.size/2 >= text.y - text.size/2 &&
            this.y - this.size/2 <= text.y + text.size/2) {
            collides = true;
        }

        return collides;
    }

}
