import type { CartProduct } from '@/shared/types/cart.ts';

import sinon from 'sinon';

import ProductOrderModel from '../model/ProductOrderModel.ts';

/**
 * @vitest-environment jsdom
 */

const productItem: CartProduct = {
  images: '',
  key: '',
  lineItemId: '',
  name: [
    {
      language: '',
      value: '',
    },
  ],
  price: 0,
  priceCouponDiscount: 0,
  productId: '',
  quantity: 0,
  size: null,
  totalPrice: 0,
  totalPriceCouponDiscount: 0,
};
const deleteCallback = sinon.fake();
const productCart = new ProductOrderModel(productItem, deleteCallback);

describe('Checking productCart', () => {
  it('should check if productCart is defined', () => {
    expect(productCart).toBeDefined();
  });

  it('should check if productCart is an instance of ProductOrderModel', () => {
    expect(productCart).toBeInstanceOf(ProductOrderModel);
  });
});
