const { Model } = require('../common/src/models/Model');

global.cache = {
  'image1.png': { width: 100, height: 100, complete: true },
  'image2.png': { width: 100, height: 100, complete: true },
};

describe('Model', () => {
  let model1, model2;

  beforeEach(() => {
    model1 = new Model('image1.png', 100, 100);
    model2 = new Model('image2.png', 150, 150);
  });

  test('rectangular collision between models', () => {
    model1 = new Model('image1.png', 0, 0);
    model2 = new Model('image2.png', 50, 50);
    expect(model1.collides(model2)).toBe(true, "Bottom right collision");
    model2.x = -50;
    expect(model1.collides(model2)).toBe(true, "Bottom left collision");
    model2.y = -50;
    expect(model1.collides(model2)).toBe(true, "Top left collision");
    model2.x = 50;
    expect(model1.collides(model2)).toBe(true, "Top right collision");
    model2 = new Model('image2.png', 100, 0);
    expect(model1.collides(model2)).toBe(true, "Edge collision");
  });

  test('no rectangular collision between models', () => {
    model1 = new Model('image1.png', 0, 0);
    model2 = new Model('image2.png', 150, 150);
    expect(model1.collides(model2)).toBe(false, "No bottom right collision");
    model2.x = -150;
    expect(model1.collides(model2)).toBe(false, "No bottom left collision");
    model2.y = -150;
    expect(model1.collides(model2)).toBe(false, "No top left collision");
    model2.x = 150;
    expect(model1.collides(model2)).toBe(false, "No top right collision");
  });

  test('circular collision between models', () => {
    model1 = new Model('image1.png', 0, 0);
    model2 = new Model('image2.png', 50, 50);
    expect(model1.collidesCircle(model2)).toBe(true, "Bottom right collision");
    model2.x = -50;
    expect(model1.collidesCircle(model2)).toBe(true, "Bottom left collision");
    model2.y = -50;
    expect(model1.collidesCircle(model2)).toBe(true, "Top left collision");
    model2.x = 50;
    expect(model1.collidesCircle(model2)).toBe(true, "Top right collision");
  });

  test('no circular collision between models', () => {
    model1 = new Model('image1.png', 0, 0);
    model2 = new Model('image2.png', 100, 100);
    expect(model1.collidesCircle(model2)).toBe(false, "No bottom right collision");
    model2.x = -100;
    expect(model1.collidesCircle(model2)).toBe(false, "No bottom left collision");
    model2.y = -100;
    expect(model1.collidesCircle(model2)).toBe(false, "No top left collision");
    model2.x = 100;
    expect(model1.collidesCircle(model2)).toBe(false, "No top right collision");
  });

  test('rectangular collision but no circular collision between models', () => {
    model1 = new Model('image1.png', 0, 0);
    model2 = new Model('image2.png', 90, 90);
    expect(model1.collides(model2)).toBe(true, "Top right collision");
    expect(model1.collidesCircle(model2)).toBe(false, "No bottom right collision");
    model2.x = -90;
    expect(model1.collides(model2)).toBe(true, "Top right collision");
    expect(model1.collidesCircle(model2)).toBe(false, "No bottom left collision");
    model2.y = -90;
    expect(model1.collides(model2)).toBe(true, "Top right collision");
    expect(model1.collidesCircle(model2)).toBe(false, "No top left collision");
    model2.x = 90;
    expect(model1.collides(model2)).toBe(true, "Top right collision");
    expect(model1.collidesCircle(model2)).toBe(false, "No top right collision");
  });
});