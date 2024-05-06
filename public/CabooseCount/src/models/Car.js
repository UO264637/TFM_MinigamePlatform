class Car extends Model {
  constructor(image, image_bg, x, y, seats) {
    super(image, x, y);

    this.background = new Background(image_bg, x, y);
    this.yv = 0;
    this.xv = 20;
    this.seats = seats;
    this.passengers = [];
    this.numPassengers = 0;
    this.passengerX = x + 470;
    this.passengerY = 400;
  }

  update() {
    this.x += this.xv;
    this.background.x = this.x;

    for (let passenger of this.passengers) {
      passenger.x += this.xv;
    }
  }

  paint() {
    this.background.paint();

    for (let passenger of this.passengers) {
      passenger.paint();
    }
    super.paint();
  }

  isFull() {
    return this.numPassengers >= this.seats;
  }

  addPassenger(passengerType) {
    if (passengerType != 0) {
      let passenger = new Background(images["passenger"+passengerType], this.passengerX, this.passengerY);
      this.passengers.push(passenger);
    }
    this.numPassengers++;
    this.passengerX -= 136.4;
  }
}
