class CenteredText extends Text {

    constructor(value, color, x, y) {
        super(value, color, x, y);
    }

    paint(){
        context.font = this.size + "px RetroGaming";
        context.fillStyle = this.color;
        context.textAlign = "left";
        
        var textWidth = context.measureText(this.value).width;
        this.width = context.measureText(this.value).width + this.size/2;
        var centeredX = this.x - textWidth/2;

        context.fillText(this.value,centeredX,this.y);
    }

}
