import type CouponModel from '@/entities/Coupon/model/CouponModel';
import type { LanguageChoiceType } from '@/shared/constants/common';
import type { languageVariants } from '@/shared/types/common';

import createBaseElement from '@/shared/utils/createBaseElement.ts';
import getCurrentLanguage from '@/shared/utils/getCurrentLanguage.ts';
import { minusCartPrice } from '@/shared/utils/messageTemplates.ts';

import styles from './summaryView.module.scss';

class SummaryView {
  private discountList: HTMLUListElement;

  private discountTotal: HTMLElement;

  private language: LanguageChoiceType;

  private title: languageVariants;

  private total = 0;

  private view: HTMLDetailsElement;

  constructor(title: languageVariants) {
    this.title = title;
    this.language = getCurrentLanguage();
    this.discountTotal = this.createSummaryHTML();
    this.discountList = createBaseElement({ cssClasses: [styles.couponsList], tag: 'ul' });
    this.view = this.createHTML();
    this.view.append(this.discountTotal, this.discountList);
  }

  private createHTML(): HTMLDetailsElement {
    this.view = createBaseElement({ cssClasses: [styles.totalWrap], tag: 'details' });
    return this.view;
  }

  private createSummaryHTML(): HTMLElement {
    return createBaseElement({ cssClasses: [styles.couponsWrap], tag: 'summary' });
  }

  private getTitle(): HTMLParagraphElement {
    return createBaseElement({
      cssClasses: [styles.title],
      innerContent: this.title[this.language],
      tag: 'p',
    });
  }

  private getValue(value: number): HTMLParagraphElement {
    return createBaseElement({
      cssClasses: [styles.title],
      innerContent: minusCartPrice(value.toFixed(2)),
      tag: 'p',
    });
  }

  private updateTitle(): void {
    this.discountTotal.innerHTML = '';
    const totalDiscountWrap = createBaseElement({ cssClasses: [styles.couponWrap], tag: 'div' });
    const totalDiscountTitle = this.getTitle();
    const totalDiscountValue = this.getValue(this.total);
    totalDiscountWrap.append(totalDiscountTitle, totalDiscountValue);
    this.discountTotal.append(totalDiscountWrap);
  }

  public addCouponItem(coupon: CouponModel): void {
    this.discountList.append(coupon.getHTML());
  }

  public getHTML(): HTMLDetailsElement {
    return this.view;
  }

  public updateLanguage(): void {
    this.language = getCurrentLanguage();
    this.updateTitle();
  }

  public updateTotal(total: number): void {
    if (total) {
      this.total = total;
      this.updateTitle();
    } else {
      this.discountTotal.innerHTML = '';
    }
  }
}

export default SummaryView;
