const { Space } = require('../common/src/Space');

describe('Space', () => {
  let space;
  let dynamicModel;
  let staticModel;

  beforeEach(() => {
    space = new Space(5);

    dynamicModel = {
      x: 0,
      y: 0,
      width: 10,
      height: 10,
      xv: 0,
      yv: 0,
    };

    staticModel = {
      x: 0,
      y: 0,
      width: 10,
      height: 10,
    };
  });

  test('add a dynamic model to the space', () => {
    space.addDinamicCorp(dynamicModel);
    expect(space.dynamic).toContain(dynamicModel);
  });

  test('add a static model to the space', () => {
    space.addStaticCorp(staticModel);
    expect(space.static).toContain(staticModel);
  });

  test('remove a dynamic model from the space', () => {
    space.addDinamicCorp(dynamicModel);
    space.removeDinamicCorp(dynamicModel);
    expect(space.dynamic).not.toContain(dynamicModel);
  });

  test('remove a static model from the space', () => {
    space.addStaticCorp(staticModel);
    space.removeStaticCorp(staticModel);
    expect(space.static).not.toContain(staticModel);
  });

  test('move dynamic model to the right without collision', () => {
    dynamicModel.xv = 10;
    staticModel.x = 25;
    space.addDinamicCorp(dynamicModel);
    space.addStaticCorp(staticModel);
    space.moveRight(0);
    expect(dynamicModel.x).toBe(10);
  });
  
  test('stop at the static model when moving right', () => {
    dynamicModel.xv = 10;
    staticModel.x = 15;
    space.addDinamicCorp(dynamicModel);
    space.addStaticCorp(staticModel);
    space.moveRight(0);
    expect(dynamicModel.x).toBe(5);
    space.moveRight(0);
    expect(dynamicModel.x).toBe(5);
  });
  
  test('move dynamic model to the left without collision', () => {
    dynamicModel.xv = -10;
    staticModel.x = -25;
    space.addDinamicCorp(dynamicModel);
    space.addStaticCorp(staticModel);
    space.moveLeft(0);
    expect(dynamicModel.x).toBe(-10);
  });
  
  test('stop at the static model when moving left', () => {
    dynamicModel.xv = -10;
    staticModel.x = -15;
    space.addDinamicCorp(dynamicModel);
    space.addStaticCorp(staticModel);
    space.moveLeft(0);
    expect(dynamicModel.x).toBe(-5);
    space.moveLeft(0);
    expect(dynamicModel.x).toBe(-5);
  });
  
  test('move dynamic model down without collision', () => {
    dynamicModel.yv = 10;
    staticModel.y = 25;
    space.addDinamicCorp(dynamicModel);
    space.addStaticCorp(staticModel);
    space.moveDown(0);
    expect(dynamicModel.y).toBe(10);
  });
  
  test('should stop at the static model when moving down', () => {
    dynamicModel.yv = 10;
    staticModel.y = 15;
    space.addDinamicCorp(dynamicModel);
    space.addStaticCorp(staticModel);
    space.moveDown(0);
    expect(dynamicModel.y).toBe(5);
    expect(dynamicModel.hitsBottom).toBe(true);
  });
  
  test('should move dynamic model up without collision', () => {
    dynamicModel.yv = -10;
    staticModel.y = -25;
    space.addDinamicCorp(dynamicModel);
    space.addStaticCorp(staticModel);
    space.moveUp(0);
    expect(dynamicModel.y).toBe(-10);
  });
  
  test('should stop at the static model when moving up', () => {
    dynamicModel.yv = -10;
    staticModel.y = -15;
    space.addDinamicCorp(dynamicModel);
    space.addStaticCorp(staticModel);
    space.moveUp(0);
    expect(dynamicModel.y).toBe(-5);
  });
  
  test('update the position of dynamic models applying gravity', () => {
    dynamicModel.yv = 0;
    space.addDinamicCorp(dynamicModel);
    space.update();
    expect(dynamicModel.yv).toBe(5);
  });
  
  test('not exceed the maximum fall speed', () => {
    dynamicModel.yv = 19;
    space.addDinamicCorp(dynamicModel);
    space.update();
    expect(dynamicModel.yv).toBe(20);
  });
  
  test('detect collision and adjust the position accordingly', () => {
    dynamicModel.yv = 10;
    space.addDinamicCorp(dynamicModel);
    space.addStaticCorp(staticModel);
    space.update();
    expect(dynamicModel.y).toBe(staticModel.y - staticModel.height / 2 - dynamicModel.height / 2);
    expect(dynamicModel.hitsBottom).toBe(true);
  });  
});