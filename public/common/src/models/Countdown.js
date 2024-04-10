class Countdown {

    constructor(color = "#FFFFFF") {
        this.value = 4;
        this.color = color;
        this.size = 150;
        this.x = originalCanvasWidth * 0.5;
        this.y = originalCanvasHeight * 0.5;
        this.oppacity = 1;

          const playNextMovement = () => {
            if (this.value == 1) {
                console.log("Go")
              this.value = "Go!";
            }
              else if (this.value == "Go!") {
                console.log("Go")
                this.value = -1;
              
            } else {
                this.value--;
                this.oppacity = 1;
                setTimeout(() => {
                    playNextMovement();
                }, 1000);
              
            }
          };
          playNextMovement();
    }

    update() {
        this.oppacity -= 0.045;
    }

    paint(){
        //console.log("A "+ console.log(this.value))
        if (this.value != null) {
            console.log(this.value)
        context.font = this.size + "px RetroGaming";
        //context.fillStyle = this.color;
        context.fillStyle = "rgba(255, 255, 255, " + this.oppacity + ")";
        context.textAlign = "left";
        //context.fillText(this.value,this.x,this.y);
        let textWidth = context.measureText(this.value).width;
        context.fillText(this.value, this.x - textWidth/2, this.y);
        }
    }
}
