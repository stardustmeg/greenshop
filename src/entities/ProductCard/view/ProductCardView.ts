import type { Variant } from '@/shared/types/product';
import type ProductCardParams from '@/shared/types/productCard.ts';

import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import LinkModel from '@/shared/Link/model/LinkModel.ts';
import LoaderModel from '@/shared/Loader/model/LoaderModel.ts';
import getStore from '@/shared/Store/Store.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import { MORE_TEXT } from '@/shared/constants/buttons.ts';
import { LANGUAGE_CHOICE } from '@/shared/constants/common.ts';
import { LINK_DETAILS } from '@/shared/constants/links.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';
import { LOADER_SIZE } from '@/shared/constants/sizes.ts';
import SVG_DETAILS from '@/shared/constants/svg.ts';
import { buildPathName } from '@/shared/utils/buildPathname.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import createSVGUse from '@/shared/utils/createSVGUse.ts';

import styles from './productCardView.module.scss';

class ProductCardView {
  private addToCardButton: ButtonModel;

  private basicPrice: HTMLSpanElement;

  private bottomWrapper: HTMLDivElement;

  private buttonsWrapper: HTMLDivElement;

  private currentSize: null | string;

  private currentVariant: Variant;

  private goDetailsPageLink: LinkModel;

  private oldPrice: HTMLSpanElement;

  private params: ProductCardParams;

  private priceWrapper: HTMLDivElement;

  private productCard: HTMLLIElement;

  private productImage: HTMLImageElement;

  private productImageWrapper: HTMLDivElement;

  private productName: HTMLHeadingElement;

  private productShortDescription: HTMLParagraphElement;

  private switchToWishListButton: ButtonModel;

  constructor(params: ProductCardParams, currentSize: null | string, currentVariant: Variant) {
    this.params = params;
    this.currentVariant = currentVariant;
    this.currentSize = currentSize;
    this.addToCardButton = this.createAddToCartButton();
    this.switchToWishListButton = this.createSwitchToWishListButton();
    this.goDetailsPageLink = this.createGoDetailsPageLink();
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

  private createBasicPrice(): HTMLSpanElement {
    const { discount, price } = this.currentVariant;
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
      this.switchToWishListButton.getHTML(),
      this.goDetailsPageLink.getHTML(),
    );

    return this.buttonsWrapper;
  }

  private createGoDetailsPageLink(): LinkModel {
    const href = `${buildPathName(PAGE_ID.PRODUCT_PAGE, this.params.key, {
      size: [this.currentSize ?? this.params.variant[0].size],
    })}`;

    this.goDetailsPageLink = new LinkModel({
      attrs: {
        href,
        target: LINK_DETAILS.BLANK,
      },
      classes: [styles.goDetailsPageLink],
    });

    const svg = document.createElementNS(SVG_DETAILS.SVG_URL, 'svg');
    svg.append(createSVGUse(SVG_DETAILS.GO_DETAILS));
    this.goDetailsPageLink.getHTML().append(svg);

    return this.goDetailsPageLink;
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
    const { discount, price } = this.currentVariant;
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
    const innerContent = this.params.name[Number(getStore().getState().currentLanguage === LANGUAGE_CHOICE.RU)].value;
    const productName = createBaseElement({
      cssClasses: [styles.productName],
      innerContent,
      tag: 'h3',
    });

    observeStore(selectCurrentLanguage, () => {
      const textContent = this.params.name[Number(getStore().getState().currentLanguage === LANGUAGE_CHOICE.RU)].value;
      productName.textContent = textContent;
    });
    return productName;
  }

  private createProductShortDescription(): HTMLParagraphElement {
    const innerContent =
      this.params.description[Number(getStore().getState().currentLanguage === LANGUAGE_CHOICE.RU)].value;
    this.productShortDescription = createBaseElement({
      cssClasses: [styles.productShortDescription],
      innerContent,
      tag: 'p',
    });

    observeStore(selectCurrentLanguage, () => {
      const textContent =
        this.params.description[Number(getStore().getState().currentLanguage === LANGUAGE_CHOICE.RU)].value;
      this.productShortDescription.textContent = textContent;
    });

    return this.productShortDescription;
  }

  private createSwitchToWishListButton(): ButtonModel {
    this.switchToWishListButton = new ButtonModel({
      classes: [styles.switchToWishListButton],
    });

    const svg = document.createElementNS(SVG_DETAILS.SVG_URL, 'svg');
    svg.append(createSVGUse(SVG_DETAILS.FILL_HEART));
    this.switchToWishListButton.getHTML().append(svg);

    return this.switchToWishListButton;
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

  public getGoDetailsPageLink(): LinkModel {
    return this.goDetailsPageLink;
  }

  public getHTML(): HTMLLIElement {
    return this.productCard;
  }

  public getSwitchToWishListButton(): ButtonModel {
    return this.switchToWishListButton;
  }

  public switchStateWishListButton(hasProductInWishList: boolean): void {
    this.switchToWishListButton.getHTML().classList.toggle(styles.inWishList, hasProductInWishList);
  }
}

export default ProductCardView;
