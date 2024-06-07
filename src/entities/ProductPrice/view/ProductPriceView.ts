import createBaseElement from '@/shared/utils/createBaseElement.ts';

import './productPriceView.scss';

class ProductPriceView {
  private basicPrice: HTMLSpanElement;

  private oldPrice: HTMLSpanElement;

  private params: { new: number; old: number };

  private view: HTMLDivElement;

  constructor(params: { new: number; old: number }) {
    this.params = params;
    this.basicPrice = this.createBasicPrice();
    this.oldPrice = this.createOldPrice();
    this.view = this.createHTML();
  }

  private createBasicPrice(): HTMLSpanElement {
    const innerContent = this.params.new ? `$${this.params.new.toFixed(2)}` : `$${this.params.old?.toFixed(2)}`;
    this.basicPrice = createBaseElement({
      cssClasses: ['basicPrice'],
      innerContent,
      tag: 'span',
    });

    if (!this.params.new) {
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
    const innerContent = this.params.new ? `$${this.params.old.toFixed(2)}` : '';
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
