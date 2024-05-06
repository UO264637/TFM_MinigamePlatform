class Car extends Model {
  constructor(image, x, y, seats) {
    super(image, x, y);

    this.yv = 0;
    this.xv = 15;
    this.seats = seats;
    this.passengers = [];
    this.numPassengers = 0;
    this.passengerX = x + 560;
    this.passengerY = 300;
  }

  update() {
    this.x += this.xv;

    for (let passenger of this.passengers) {
      passenger.x += this.xv;
    }
  }

  paint() {
    super.paint();

    for (let passenger of this.passengers) {
      passenger.paint();
    }
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
    this.passengerX -= 160;
  }
}
