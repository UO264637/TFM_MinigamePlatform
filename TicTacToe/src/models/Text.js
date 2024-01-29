class Text {

    constructor(value, x, y) {
        this.value = value;
        this.x = x;
        this.y = y;
    }

    paint(){
        context.font = "24px RetroGaming";
        context.fillStyle = "#563F2E";
        context.textAlign = "left";
        context.fillText(this.value,this.x,this.y);
    }

}
