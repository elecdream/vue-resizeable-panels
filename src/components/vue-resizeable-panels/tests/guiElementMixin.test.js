const { guiElementMixin } = require('../mixins/guiElementMixin');

describe('test mixin', () => {

  test('setWidth()', () => {

    let ctx = { width: 150, min_width: 100 }
    let func = guiElementMixin.methods.setWidth.bind(ctx);

    let left = func(50);
    expect(left).toBe(50);
    expect(ctx.width).toBe(100);
  })


})