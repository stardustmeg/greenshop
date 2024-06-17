import createBaseElement from '@/shared/utils/createBaseElement.ts';

import CartPageModel from '../model/CartPageModel.ts';

/**
 * @vitest-environment jsdom
 */

const parent = createBaseElement({
  tag: 'div',
});
const cart = new CartPageModel(parent);

describe('Checking cart', () => {
  it('should check if post is defined', () => {
    expect(cart).toBeDefined();
  });

  it('should check if cart is an instance of CartPageModel', () => {
    expect(cart).toBeInstanceOf(CartPageModel);
  });
});
