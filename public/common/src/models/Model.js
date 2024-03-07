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

    collides (model){
        let collides = false;
    
        if ( model.x - model.width/2 <=  this.x + this.width/2
            && model.x + model.width/2 >= this.x - this.width/2
            && this.y + this.height/2 >= model.y - model.height/2
            && this.y - this.height/2 <= model.y + model.height/2 ){
    
            collides = true;
    
        }
        return collides;
    }
    

}
