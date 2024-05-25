import type { Variant } from '@/shared/types/product';

import createBaseElement from '@/shared/utils/createBaseElement.ts';

import './productPriceView.scss';

class ProductPriceView {
  private basicPrice: HTMLSpanElement;

  private currentVariant: Variant;

  private oldPrice: HTMLSpanElement;

  private view: HTMLDivElement;

  constructor(currentVariant: Variant) {
    this.currentVariant = currentVariant;
    this.basicPrice = this.createBasicPrice();
    this.oldPrice = this.createOldPrice();
    this.view = this.createHTML();
  }

  private createBasicPrice(): HTMLSpanElement {
    const innerContent = this.currentVariant.discount
      ? `$${this.currentVariant.discount.toFixed(2)}`
      : `$${this.currentVariant.price?.toFixed(2)}`;
    this.basicPrice = createBaseElement({
      cssClasses: ['basicPrice'],
      innerContent,
      tag: 'span',
    });

    if (!this.currentVariant.discount) {
      this.basicPrice.classList.add('gray');
    }

    return this.basicPrice;
  }

  private createHTML(): HTMLDivElement {
    this.view = createBaseElement({
      cssClasses: ['priceWrapper'],
      tag: 'div',
    });

    this.view.append(this.basicPrice, this.oldPrice);
    return this.view;
  }

  private createOldPrice(): HTMLSpanElement {
    const innerContent = this.currentVariant.discount ? `$${this.currentVariant.price?.toFixed(2)}` : '';
    this.oldPrice = createBaseElement({
      cssClasses: ['oldPrice'],
      innerContent,
      tag: 'span',
    });

    return this.oldPrice;
  }

  public getHTML(): HTMLDivElement {
    return this.view;
  }
}

export default ProductPriceView;
