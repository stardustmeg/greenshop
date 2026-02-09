import type { CartCoupon, Coupon } from '@/shared/types/cart.ts';
import type { languageVariants } from '@/shared/types/common.ts';

import CouponModel from '@/entities/Coupon/model/CouponModel.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';

import SummaryView from '../view/SummaryView.ts';

export type DeleteCallback = (coupon: Coupon) => Promise<void>;

class SummaryModel {
  private coupons: CouponModel[] = [];

  private deleteCallback: DeleteCallback;

  private view: SummaryView;

  constructor(title: languageVariants, deleteCallback: DeleteCallback) {
    this.deleteCallback = deleteCallback;
    this.view = new SummaryView(title);
    this.init();
  }

  private init(): void {
    observeStore(selectCurrentLanguage, () => this.view.updateLanguage());
  }

  public addCoupon(coupon: CartCoupon): void {
    const couponModel = new CouponModel(coupon, this.deleteCallback);
    this.coupons.push(couponModel);
    this.view.addCouponItem(couponModel);
    this.updateTotal();
  }

  public getHTML(): HTMLDetailsElement {
    return this.view.getHTML();
  }

  public update(coupons: CartCoupon[]): void {
    coupons.forEach((discount) => {
      const searchCoupon = this.coupons.find(
        (coupon) => coupon.getCouponData().coupon.discountCode === discount.coupon.discountCode,
      );
      if (!searchCoupon) {
        this.addCoupon(discount);
      } else {
        searchCoupon.update(discount.value);
      }
    });
    this.coupons.forEach((coupon) => {
      const searchDiscount = coupons.find(
        (discount) => discount.coupon.discountCode === coupon.getCouponData().coupon.discountCode,
      );
      if (!searchDiscount) {
        this.coupons = this.coupons.filter((el) => el !== coupon);
        coupon.getHTML().remove();
      }
    });
    this.updateTotal();
  }

  public updateTotal(): void {
    const total = this.coupons.reduce((total, coupon) => total + coupon.getCouponData().value, 0);
    this.view.updateTotal(total);
  }
}

export default SummaryModel;
