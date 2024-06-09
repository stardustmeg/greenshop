import type { DeleteCallback } from '@/entities/Summary/model/SummaryModel';
import type { CartCoupon } from '@/shared/types/cart';

import createBaseElement from '@/shared/utils/createBaseElement.ts';
import { minusCartPrice } from '@/shared/utils/messageTemplates.ts';

import styles from './couponView.module.scss';

class CouponView {
  private coupon: CartCoupon;

  private couponValue: HTMLParagraphElement;

  private deleteCallback: DeleteCallback;

  private view: HTMLLIElement;

  constructor(coupon: CartCoupon, deleteCallback: DeleteCallback) {
    this.deleteCallback = deleteCallback;
    this.coupon = coupon;
    this.couponValue = createBaseElement({
      cssClasses: [styles.title],
      innerContent: minusCartPrice(this.coupon.value.toFixed(2)),
      tag: 'p',
    });
    this.view = this.createHTML();
  }

  private createHTML(): HTMLLIElement {
    this.view = createBaseElement({ cssClasses: [styles.couponWrap], tag: 'li' });
    const couponTitle = createBaseElement({
      cssClasses: [styles.title],
      innerContent: this.coupon.coupon.discountCode,
      tag: 'p',
    });

    const couponWrap = createBaseElement({ cssClasses: [styles.coupon], tag: 'div' });
    const deleteCoupon = createBaseElement({ cssClasses: [styles.deleteCoupon], tag: 'button' });
    deleteCoupon.addEventListener('click', () => this.deleteCallback(this.coupon.coupon));
    couponWrap.append(deleteCoupon, couponTitle);
    this.view.append(couponWrap, this.couponValue);

    return this.view;
  }

  public getHTML(): HTMLLIElement {
    return this.view;
  }

  public update(value: number): void {
    this.couponValue.innerHTML = minusCartPrice(value.toFixed(2));
  }
}

export default CouponView;
