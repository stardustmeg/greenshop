import type { ProductInfoParams } from '@/shared/types/product';

import createBaseElement from '@/shared/utils/createBaseElement.ts';

import styles from './productInfoView.module.scss';

class ProductInfoView {
  private basicPrice: HTMLSpanElement;

  private oldPrice: HTMLSpanElement;

  private params: ProductInfoParams;

  private priceWrapper: HTMLDivElement;

  private shortDescription: HTMLParagraphElement;

  private title: HTMLHeadingElement;

  private view: HTMLDivElement;

  constructor(params: ProductInfoParams) {
    this.params = params;
    this.title = this.createProductTitle();
    this.basicPrice = this.createBasicPrice();
    this.oldPrice = this.createOldPrice();
    this.priceWrapper = this.createPriceWrapper();
    this.shortDescription = this.createShortDescription();
    this.view = this.createHTML();
  }

  private createBasicPrice(): HTMLSpanElement {
    const currentVariant =
      this.params.variant.find(({ size }) => size === this.params.currentSize) ?? this.params.variant[0];
    const { discount, price } = currentVariant;
    const innerContent = discount ? `$${discount.toFixed(2)}` : `$${price?.toFixed(2)}`;
    this.basicPrice = createBaseElement({
      cssClasses: [styles.basicPrice],
      innerContent,
      tag: 'span',
    });

    if (!discount) {
      this.basicPrice.classList.add(styles.gray);
    }

    return this.basicPrice;
  }

  private createHTML(): HTMLDivElement {
    this.view = createBaseElement({
      cssClasses: [styles.wrapper],
      tag: 'div',
    });

    const leftWrapper = createBaseElement({
      cssClasses: [styles.leftWrapper],
      tag: 'div',
    });

    const imageWrapper = createBaseElement({
      cssClasses: [styles.imageWrapper],
      tag: 'div',
    });

    imageWrapper.append(this.createProductImage());
    leftWrapper.append(imageWrapper);

    const rightWrapper = createBaseElement({
      cssClasses: [styles.rightWrapper],
      tag: 'div',
    });

    const shortDescriptionWrapper = createBaseElement({
      cssClasses: [styles.shortDescriptionWrapper],
      tag: 'div',
    });

    shortDescriptionWrapper.append(this.shortDescription);
    rightWrapper.append(this.title, this.priceWrapper, shortDescriptionWrapper);

    this.view.append(leftWrapper, rightWrapper);
    return this.view;
  }

  private createOldPrice(): HTMLSpanElement {
    const currentVariant =
      this.params.variant.find(({ size }) => size === this.params.currentSize) ?? this.params.variant[0];
    const { discount, price } = currentVariant;
    const innerContent = discount ? `$${price?.toFixed(2)}` : '';
    this.oldPrice = createBaseElement({
      cssClasses: [styles.oldPrice],
      innerContent,
      tag: 'span',
    });

    return this.oldPrice;
  }

  private createPriceWrapper(): HTMLDivElement {
    this.priceWrapper = createBaseElement({
      cssClasses: [styles.priceWrapper],
      tag: 'div',
    });

    this.priceWrapper.append(this.basicPrice, this.oldPrice);
    return this.priceWrapper;
  }

  private createProductImage(): HTMLImageElement {
    return createBaseElement({
      attributes: {
        alt: this.params.name[0].value,
        src: this.params.images[0],
      },
      cssClasses: [styles.image],
      tag: 'img',
    });
  }

  private createProductTitle(): HTMLHeadingElement {
    this.title = createBaseElement({
      cssClasses: [styles.title],
      innerContent: this.params.name[0].value,
      tag: 'h3',
    });

    return this.title;
  }

  private createShortDescription(): HTMLParagraphElement {
    this.shortDescription = createBaseElement({
      cssClasses: [styles.shortDescription],
      innerContent: this.params.description[0].value,
      tag: 'p',
    });
    return this.shortDescription;
  }

  public getHTML(): HTMLDivElement {
    return this.view;
  }
}

export default ProductInfoView;
