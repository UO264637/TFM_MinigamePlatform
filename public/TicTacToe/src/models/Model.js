class Model {

    constructor(imagenRuta, x, y) {
        this.image = new Image();
        this.image.src = imagenRuta;
        this.x = x;
        this.y = y;
        this.width = this.image.width;
        this.height = this.image.height;
    }

    paint (){
        context.drawImage(this.image,
            this.x - this.width /2,
            this.y - this.height /2);
    }

}
