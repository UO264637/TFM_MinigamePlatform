class CenteredText extends Text {

    constructor(value, x, y) {
        super(value, x, y);
    }

    paint(){
        context.font = "24px RetroGaming";
        context.fillStyle = "#563F2E";
        context.textAlign = "left";
        
        var textWidth = context.measureText(this.value).width;
        var centeredX = this.x - textWidth/2;

        context.fillText(this.value,centeredX,this.y);
    }

}
