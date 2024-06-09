import type { DeleteCallback } from '@/entities/Summary/model/SummaryModel.ts';
import type { CartCoupon } from '@/shared/types/cart.ts';

import CouponView from '../view/CouponView.ts';

class CouponModel {
  private coupon: CartCoupon;

  private view: CouponView;

  constructor(coupon: CartCoupon, deleteCallback: DeleteCallback) {
    this.coupon = coupon;
    this.view = new CouponView(this.coupon, deleteCallback);
    this.init();
  }

  private init(): void {}

  public getCouponData(): CartCoupon {
    return this.coupon;
  }

  public getHTML(): HTMLLIElement {
    return this.view.getHTML();
  }

  public update(value: number): void {
    this.coupon.value = value;
    this.view.update(value);
  }
}

export default CouponModel;
