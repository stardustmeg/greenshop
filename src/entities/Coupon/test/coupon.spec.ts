import type { CartCoupon } from '@/shared/types/cart.ts';

import sinon from 'sinon';

import CouponModel from '../model/CouponModel.ts';

/**
 * @vitest-environment jsdom
 */
const coupon: CartCoupon = {
  coupon: {
    cartDiscount: '',
    discountCode: '',
    id: '',
  },
  value: 10,
};

const deleteCallback = sinon.fake();
const couponModel = new CouponModel(coupon, deleteCallback);

describe('Checking CustomerApi', () => {
  it('should check if root is defined', () => {
    expect(couponModel).toBeDefined();
  });

  it('should check if CustomerApi is an instance of CustomerApi', () => {
    expect(couponModel).toBeInstanceOf(CouponModel);
  });
});
