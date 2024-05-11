import type { SizeType } from '@/shared/types/product';
import type ProductCardParams from '@/shared/types/productCard.ts';

import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import LinkModel from '@/shared/Link/model/LinkModel.ts';
import LoaderModel from '@/shared/Loader/model/LoaderModel.ts';
import getStore from '@/shared/Store/Store.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import { MORE_TEXT } from '@/shared/constants/buttons.ts';
import { SIZES } from '@/shared/constants/sizes.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

import styles from './productCardView.module.scss';

class ProductCardView {
  private basicPrice: HTMLSpanElement;

  private bottomWrapper: HTMLDivElement;

  private oldPrice: HTMLSpanElement;

  private params: ProductCardParams;

  private priceWrapper: HTMLDivElement;

  private productCard: HTMLLIElement;

  private productImage: HTMLImageElement;

  private productImageWrapper: HTMLDivElement;

  private productLink: LinkModel;

  private productName: HTMLHeadingElement;

  private productShortDescription: HTMLParagraphElement;

  private size: SizeType;

  constructor(params: ProductCardParams, size: SizeType) {
    this.size = size;
    this.params = params;
    this.productImage = this.createProductImage();
    this.productImageWrapper = this.createProductImageWrapper();
    this.productName = this.createProductName();
    this.productShortDescription = this.createProductShortDescription();
    this.productLink = this.createProductLink();
    this.basicPrice = this.createBasicPrice();
    this.oldPrice = this.createOldPrice();
    this.priceWrapper = this.createPriceWrapper();
    this.bottomWrapper = this.createBottomWrapper();
    this.productCard = this.createHTML();
  }

  private changeButtonText(productShortDescription: HTMLParagraphElement, moreButton: HTMLButtonElement): void {
    const { currentLanguage } = getStore().getState();
    const moreText = MORE_TEXT[currentLanguage];
    const button = moreButton;

    productShortDescription.classList.toggle(styles.active);
    button.textContent = button.textContent === moreText.HIDE ? moreText.MORE : moreText.HIDE;
  }

  private createBasicPrice(): HTMLSpanElement {
    const { discount, price } = this.params.variant.find(({ size }) => size === this.size) ?? {};
    this.basicPrice = createBaseElement({
      cssClasses: [styles.basicPrice],
      innerContent: discount ? `$${discount.toFixed(2)}` : `$${price?.toFixed(2)}`,
      tag: 'span',
    });

    if (!discount) {
      this.basicPrice.classList.add(styles.gray);
    }

    return this.basicPrice;
  }

  private createBottomWrapper(): HTMLDivElement {
    this.bottomWrapper = createBaseElement({
      cssClasses: [styles.bottomWrapper],
      tag: 'div',
    });

    const moreButton = this.createMoreButton();

    observeStore(selectCurrentLanguage, () => {
      this.updateMoreButtonText(moreButton);
    });

    moreButton.addEventListener('click', () => this.changeButtonText(this.productShortDescription, moreButton));

    this.bottomWrapper.append(this.productName, this.priceWrapper, this.productShortDescription, moreButton);
    return this.bottomWrapper;
  }

  private createHTML(): HTMLLIElement {
    this.productCard = createBaseElement({
      cssClasses: [styles.productCard],
      tag: 'li',
    });

    this.productCard.append(this.productImageWrapper, this.bottomWrapper, this.productLink.getHTML());
    return this.productCard;
  }

  private createMoreButton(): HTMLButtonElement {
    const moreButton = new ButtonModel({
      classes: [styles.moreButton],
      text: MORE_TEXT[getStore().getState().currentLanguage].MORE,
    });

    return moreButton.getHTML();
  }

  private createOldPrice(): HTMLSpanElement {
    const { discount, price } = this.params.variant.find(({ size }) => size === this.size) ?? {};
    this.oldPrice = createBaseElement({
      cssClasses: [styles.oldPrice],
      innerContent: discount ? `$${price?.toFixed(2)}` : '',
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
    const productImage = createBaseElement({
      attributes: {
        src: this.params.images[0],
      },
      cssClasses: [styles.productImage],
      tag: 'img',
    });
    return productImage;
  }

  private createProductImageWrapper(): HTMLDivElement {
    this.productImageWrapper = createBaseElement({
      cssClasses: [styles.productImageWrapper],
      tag: 'div',
    });

    const loader = new LoaderModel(SIZES.MEDIUM).getHTML();
    this.productImageWrapper.append(this.productImage, loader);
    this.productImage.classList.add(styles.hidden);

    this.productImage.addEventListener('load', () => {
      this.productImage.classList.remove(styles.hidden);
      loader.remove();
    });
    return this.productImageWrapper;
  }

  private createProductLink(): LinkModel {
    this.productLink = new LinkModel({
      attrs: {
        href: this.params.key,
      },
      classes: [styles.productLink],
    });

    this.productLink.getHTML().addEventListener('click', (event) => {
      event.preventDefault();
      window.location.href = this.params.key;
    });

    return this.productLink;
  }

  private createProductName(): HTMLHeadingElement {
    const productName = createBaseElement({
      cssClasses: [styles.productName],
      innerContent: this.params.name[0].value,
      tag: 'h3',
    });
    return productName;
  }

  private createProductShortDescription(): HTMLParagraphElement {
    this.productShortDescription = createBaseElement({
      cssClasses: [styles.productShortDescription],
      innerContent: this.params.description[0].value,
      tag: 'p',
    });

    return this.productShortDescription;
  }

  private updateMoreButtonText(moreButton: HTMLButtonElement): void {
    const { currentLanguage } = getStore().getState();
    const moreText = MORE_TEXT[currentLanguage];
    const isActive = this.productShortDescription.classList.contains(styles.active);
    const button = moreButton;

    button.textContent = isActive ? moreText.HIDE : moreText.MORE;
  }

  public getHTML(): HTMLLIElement {
    return this.productCard;
  }
}

export default ProductCardView;
