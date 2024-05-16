import type ProductCardParams from '@/shared/types/productCard.ts';

import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import LoaderModel from '@/shared/Loader/model/LoaderModel.ts';
import getStore from '@/shared/Store/Store.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import { MORE_TEXT } from '@/shared/constants/buttons.ts';
import { LANGUAGE_CHOICE } from '@/shared/constants/common.ts';
import { LOADER_SIZE } from '@/shared/constants/sizes.ts';
import SVG_DETAILS from '@/shared/constants/svg.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import createSVGUse from '@/shared/utils/createSVGUse.ts';

import styles from './productCardView.module.scss';

class ProductCardView {
  private addToCardButton: ButtonModel;

  private addToWishListButton: ButtonModel;

  private basicPrice: HTMLSpanElement;

  private bottomWrapper: HTMLDivElement;

  private buttonsWrapper: HTMLDivElement;

  private goDetailsPageButton: ButtonModel;

  private oldPrice: HTMLSpanElement;

  private params: ProductCardParams;

  private priceWrapper: HTMLDivElement;

  private productCard: HTMLLIElement;

  private productImage: HTMLImageElement;

  private productImageWrapper: HTMLDivElement;

  private productName: HTMLHeadingElement;

  private productShortDescription: HTMLParagraphElement;

  private size: null | string;

  constructor(params: ProductCardParams, size: null | string) {
    this.size = size;
    this.params = params;
    this.addToCardButton = this.createAddToCartButton();
    this.addToWishListButton = this.createAddToWishListButton();
    this.goDetailsPageButton = this.createGoDetailsPageButton();
    this.buttonsWrapper = this.createButtonsWrapper();
    this.productImage = this.createProductImage();
    this.productImageWrapper = this.createProductImageWrapper();
    this.productName = this.createProductName();
    this.productShortDescription = this.createProductShortDescription();
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

  private createAddToCartButton(): ButtonModel {
    this.addToCardButton = new ButtonModel({
      classes: [styles.addToCardButton],
    });

    const svg = document.createElementNS(SVG_DETAILS.SVG_URL, 'svg');
    svg.append(createSVGUse(SVG_DETAILS.CART));
    this.addToCardButton.getHTML().append(svg);

    return this.addToCardButton;
  }

  private createAddToWishListButton(): ButtonModel {
    this.addToWishListButton = new ButtonModel({
      classes: [styles.addToWishListButton],
    });

    const svg = document.createElementNS(SVG_DETAILS.SVG_URL, 'svg');
    svg.append(createSVGUse(SVG_DETAILS.FILL_HEART));
    this.addToWishListButton.getHTML().append(svg);

    return this.addToWishListButton;
  }

  private createBasicPrice(): HTMLSpanElement {
    const { discount, price } = this.params.variant.find(({ size }) => size === this.size) ?? this.params.variant[0];
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

  private createButtonsWrapper(): HTMLDivElement {
    this.buttonsWrapper = createBaseElement({
      cssClasses: [styles.buttonsWrapper],
      tag: 'div',
    });

    this.buttonsWrapper.append(
      this.addToCardButton.getHTML(),
      this.addToWishListButton.getHTML(),
      this.goDetailsPageButton.getHTML(),
    );

    return this.buttonsWrapper;
  }

  private createGoDetailsPageButton(): ButtonModel {
    this.goDetailsPageButton = new ButtonModel({
      classes: [styles.goDetailsPageButton],
    });

    const svg = document.createElementNS(SVG_DETAILS.SVG_URL, 'svg');
    svg.append(createSVGUse(SVG_DETAILS.GO_DETAILS));
    this.goDetailsPageButton.getHTML().append(svg);

    return this.goDetailsPageButton;
  }

  private createHTML(): HTMLLIElement {
    this.productCard = createBaseElement({
      cssClasses: [styles.productCard],
      tag: 'li',
    });

    this.productCard.addEventListener('mouseenter', () => this.buttonsWrapper.classList.add(styles.visible));

    this.productCard.addEventListener('mouseleave', () => this.buttonsWrapper.classList.remove(styles.visible));

    this.productCard.append(this.productImageWrapper, this.bottomWrapper);
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
    const { discount, price } = this.params.variant.find(({ size }) => size === this.size) ?? this.params.variant[0];
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
    const productImage = createBaseElement({
      attributes: {
        alt: this.params.name[0].value,
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

    const loader = new LoaderModel(LOADER_SIZE.MEDIUM).getHTML();
    this.productImageWrapper.append(this.productImage, loader, this.createButtonsWrapper());
    this.productImage.classList.add(styles.hidden);

    this.productImage.addEventListener('load', () => {
      this.productImage.classList.remove(styles.hidden);
      loader.remove();
    });
    return this.productImageWrapper;
  }

  private createProductName(): HTMLHeadingElement {
    // TBD: replace on locale
    const innerContent = this.params.name[getStore().getState().currentLanguage === LANGUAGE_CHOICE.EN ? 0 : 1].value;
    const productName = createBaseElement({
      cssClasses: [styles.productName],
      innerContent,
      tag: 'h3',
    });

    observeStore(selectCurrentLanguage, () => {
      // TBD: replace on locale
      const textContent = this.params.name[getStore().getState().currentLanguage === LANGUAGE_CHOICE.EN ? 0 : 1].value;
      productName.textContent = textContent;
    });
    return productName;
  }

  private createProductShortDescription(): HTMLParagraphElement {
    // TBD: replace on locale
    const innerContent =
      this.params.description[getStore().getState().currentLanguage === LANGUAGE_CHOICE.EN ? 0 : 1].value;
    this.productShortDescription = createBaseElement({
      cssClasses: [styles.productShortDescription],
      innerContent,
      tag: 'p',
    });

    observeStore(selectCurrentLanguage, () => {
      // TBD: replace on locale
      const textContent =
        this.params.description[getStore().getState().currentLanguage === LANGUAGE_CHOICE.EN ? 0 : 1].value;
      this.productShortDescription.textContent = textContent;
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

  public getAddToCardButton(): ButtonModel {
    return this.addToCardButton;
  }

  public getAddToWishListButton(): ButtonModel {
    return this.addToWishListButton;
  }

  public getGoDetailsPageButton(): ButtonModel {
    return this.goDetailsPageButton;
  }

  public getHTML(): HTMLLIElement {
    return this.productCard;
  }
}

export default ProductCardView;
