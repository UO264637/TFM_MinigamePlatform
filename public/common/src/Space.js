class Space {

    constructor(gravity) {
        this.gravity = gravity;
        this.dynamic = [];
        this.static = [];
    }

    addDinamicCorp(model) {
        this.dynamic.push(model);
    }

    addStaticCorp(model) {
        this.static.push(model);
    }

    removeDinamicCorp(model) {
        for (var i = 0; i < this.dynamic.length; i++) {
            if (this.dynamic[i] == model) {
                this.dynamic.splice(i, 1);
            }
        }
    }

    removeStaticCorp(model) {
        for (var i = 0; i < this.static.length; i++) {
            if (this.static[i] == model) {
                this.static.splice(i, 1);
            }
        }
    }

    update() {
        for (var i = 0; i < this.dynamic.length; i++) {

            // aplicar gravity ( dynamic)
            this.dynamic[i].yv = this.dynamic[i].yv + this.gravity;
            // maxima velocidad de caida por gravity
            if (this.dynamic[i].yv > 20) {
                this.dynamic[i].yv = 20;
            }

            this.dynamic[i].hitsBottom = false;

            //derecha
            this.moveRight(i);
            this.moveLeft(i);
            this.moveUp(i);
            this.moveDown(i);

        }

    }

    moveRight(i) {
        if (this.dynamic[i].xv > 0) {
            var possibleMovement = this.dynamic[i].xv;
            // El mejor "idealmente" xv partimos de ese

            for (var j = 0; j < this.static.length; j++) {
                var dynamicRight
                    = this.dynamic[i].x + this.dynamic[i].width / 2;
                var dynamicTop
                    = this.dynamic[i].y - this.dynamic[i].height / 2;
                var dynamicDown
                    = this.dynamic[i].y + this.dynamic[i].height / 2;
                var staticLeft
                    = this.static[j].x - this.static[j].width / 2;
                var staticTop
                    = this.static[j].y - this.static[j].height / 2;
                var staticDown
                    = this.static[j].y + this.static[j].height / 2;

                // Alerta!, Elemento estático en la trayectoria.
                if ((dynamicRight + this.dynamic[i].xv) >= staticLeft
                    && dynamicRight <= staticLeft
                    && staticTop < dynamicDown
                    && staticDown > dynamicTop) {

                    // Comprobamos si la distancia al estático es menor
                    // que nuestro possibleMovement actual
                    if (possibleMovement >= staticLeft - dynamicRight) {
                        // La distancia es MENOR que nuestro movimiento posible
                        // Tenemos que actualizar el movimiento posible a uno menor
                        possibleMovement = staticLeft - dynamicRight;
                    }

                }

            }
            // Ya se han comprobado todos los estáticos
            this.dynamic[i].x = this.dynamic[i].x + possibleMovement;
            this.dynamic[i].xv = possibleMovement;
        }
    }

    moveLeft(i) {

        // Izquierda
        if (this.dynamic[i].xv < 0) {
            var possibleMovement = this.dynamic[i].xv;
            // El mejor "idealmente" xv partimos de ese

            for (var j = 0; j < this.static.length; j++) {
                var dynamicLeft
                    = this.dynamic[i].x - this.dynamic[i].width / 2;
                var dynamicTop
                    = this.dynamic[i].y - this.dynamic[i].height / 2;
                var dynamicDown
                    = this.dynamic[i].y + this.dynamic[i].height / 2;
                var staticRight
                    = this.static[j].x + this.static[j].width / 2;
                var staticTop
                    = this.static[j].y - this.static[j].height / 2;
                var staticDown
                    = this.static[j].y + this.static[j].height / 2;

                // Alerta!, Elemento estático en la trayectoria.
                if ((dynamicLeft + this.dynamic[i].xv) <= staticRight
                    && dynamicLeft >= staticRight
                    && staticTop < dynamicDown
                    && staticDown > dynamicTop) {

                    // Comprobamos si la distancia al estático es mayor
                    // que nuestro possibleMovement actual
                    if (possibleMovement <= staticRight - dynamicLeft) {
                        // La distancia es MAYOR que nuestro movimiento posible
                        // Tenemos que actualizar el movimiento posible a uno mayor
                        possibleMovement = staticRight - dynamicLeft;
                    }

                }
            }

            // Ya se han comprobado todos los static
            this.dynamic[i].x = this.dynamic[i].x + possibleMovement;
            this.dynamic[i].xv = possibleMovement;
        }

    }

    moveDown(i) {
        if (this.dynamic[i].yv > 0) {
            var possibleMovement = this.dynamic[i].yv;
            // El mejor "idealmente" es la velocidad yv.

            for (var j = 0; j < this.static.length; j++) {
                var dynamicTop
                    = this.dynamic[i].y - this.dynamic[i].height / 2;
                var dynamicDown
                    = this.dynamic[i].y + this.dynamic[i].height / 2;
                var dynamicRight
                    = this.dynamic[i].x + this.dynamic[i].width / 2;
                var dynamicLeft
                    = this.dynamic[i].x - this.dynamic[i].width / 2;
                var staticTop
                    = this.static[j].y - this.static[j].height / 2;
                var staticDown
                    = this.static[j].y + this.static[j].height / 2;
                var staticRight
                    = this.static[j].x + this.static[j].width / 2;
                var staticLeft
                    = this.static[j].x - this.static[j].width / 2;

                // Alerta!, Elemento estático en la trayectoria.
                if ((dynamicDown + this.dynamic[i].yv) >= staticTop &&
                    dynamicTop < staticDown
                    && dynamicLeft < staticRight
                    && dynamicRight > staticLeft) {

                    // Comprobamos si la distancia al estático es menor
                    // que nuestro possibleMovement actual
                    if (possibleMovement >= staticTop - dynamicDown) {
                        // La distancia es MENOR que nuestro movimiento posible
                        // Tenemos que actualizar el movimiento posible a uno menor
                        possibleMovement = staticTop - dynamicDown;
                        this.dynamic[i].hitsBottom = true;
                    }
                }
            }

            // Ya se han comprobado todos los estáticos
            this.dynamic[i].y = this.dynamic[i].y + possibleMovement;
            this.dynamic[i].yv = possibleMovement;
        }
    }

    moveUp(i) {
        if (this.dynamic[i].yv < 0) {
            var possibleMovement = this.dynamic[i].yv;
            // El mejor "idealmente" es la velocidad yv.

            for (var j = 0; j < this.static.length; j++) {
                var dynamicTop
                    = this.dynamic[i].y - this.dynamic[i].height / 2;
                var dynamicDown
                    = this.dynamic[i].y + this.dynamic[i].height / 2;
                var dynamicRight
                    = this.dynamic[i].x + this.dynamic[i].width / 2;
                var dynamicLeft
                    = this.dynamic[i].x - this.dynamic[i].width / 2;
                var staticTop
                    = this.static[j].y - this.static[j].height / 2;
                var staticDown
                    = this.static[j].y + this.static[j].height / 2;
                var staticRight
                    = this.static[j].x + this.static[j].width / 2;
                var staticLeft
                    = this.static[j].x - this.static[j].width / 2;

                // Alerta!, Elemento estático en la trayectoria
                if ((dynamicTop + this.dynamic[i].yv) <= staticDown &&
                    dynamicDown > staticTop
                    && dynamicLeft < staticRight
                    && dynamicRight > staticLeft) {

                    // Comprobamos si la distancia al estático es MAYOR
                    // que nuestro possibleMovement actual
                    if (possibleMovement <= staticDown - dynamicTop) {
                        // La distancia es MAYOR que nuestro movimiento posible
                        // Tenemos que actualizar el movimiento posible a uno mayor

                        possibleMovement = staticDown - dynamicTop;
                    }

                }
            }

            this.dynamic[i].y = this.dynamic[i].y + possibleMovement;
            this.dynamic[i].yv = possibleMovement;
        }
    }




}
