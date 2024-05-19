class Player extends Model {
  constructor(image, resultsImage, x, y, position) {
    super(image, x, y);

    this.tag = new CenteredText("", "#FFFFFF", x, y);

    let resultX = position == "left" ? x - 115 : x + 115;
    this.result = new CenteredText("", "#563F2E", resultX, y - 5);

    this.resultsPose = new Background(resultsImage, x, y);
  }

  paint() {
    super.paint();

    if (this.resultTime) {
      this.resultsPose.paint();
    }

    this.tag.paint();
    this.result.paint();
  }

  setName(name) {
    this.tag.value = name;
  }

  showResult(result) {
    this.result.value = result;
    this.resultTime = true;
  }
}
