class Player extends Model {
  constructor(image, resultsImage, x, y, position) {
    super(image, x, y);

    this.tag = new CenteredText("", "#FFFFFF", x, y);

    let resultX = position == "left" ? x - 115 : x + 115;
    this.result = new CenteredText("", "#563F2E", resultX, y - 5);

    this.resultsPose = new Background(resultsImage, x, y);
  }

  paint(resultTime) {
    super.paint();

    if (resultTime) {
      this.resultsPose.paint();
      this.result.paint();
    }

    this.tag.paint();
  }

  setName(name) {
    this.tag.value = name;
  }

  showResult(result) {
    this.result.value = result;
  }
}
