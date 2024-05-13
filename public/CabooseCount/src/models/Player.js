class Player extends Model {
  constructor(x, y, position) {
    super(images.player_back, x, y);

    this.tag = new CenteredText("", "#FFFFFF", x, y);

    let resultX = position == "left" ? x - 125 : x + 125;
    this.result = new CenteredText("", "#FFFFFF", resultX, y - 50);
  }

  paint() {
    super.paint();
    this.tag.paint();
    this.result.paint();
  }

  setName(name) {
    this.tag.value = name;
  }

  showResult(result) {
    this.result.value = result;
  }
}
