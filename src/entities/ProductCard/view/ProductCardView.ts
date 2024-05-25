import type ProductCardParams from '@/shared/types/productCard.ts';

import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import LinkModel from '@/shared/Link/model/LinkModel.ts';
import LoaderModel from '@/shared/Loader/model/LoaderModel.ts';
import getStore from '@/shared/Store/Store.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import { MORE_TEXT } from '@/shared/constants/buttons.ts';
import { LANGUAGE_CHOICE } from '@/shared/constants/common.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';
import { LOADER_SIZE } from '@/shared/constants/sizes.ts';
import SVG_DETAILS from '@/shared/constants/svg.ts';
import { buildPathName } from '@/shared/utils/buildPathname.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import createSVGUse from '@/shared/utils/createSVGUse.ts';

import styles from './productCardView.module.scss';

class ProductCardView {
  private addToCartButton: ButtonModel;

  private bottomWrapper: HTMLDivElement;

  private buttonsWrapper: HTMLDivElement;

  private currentSize: null | string;

  private goDetailsPageLink: LinkModel;

  private moreButton: ButtonModel;

  private params: ProductCardParams;

  private productCard: HTMLLIElement;

  private productImage: HTMLImageElement;

  private productImageWrapper: HTMLDivElement;

  private productName: HTMLHeadingElement;

  private productShortDescription: HTMLParagraphElement;

  private switchToWishListButton: ButtonModel;

  constructor(params: ProductCardParams, currentSize: null | string) {
    this.params = params;
    this.currentSize = currentSize;
    this.addToCartButton = this.createAddToCartButton();
    this.switchToWishListButton = this.createSwitchToWishListButton();
    this.goDetailsPageLink = this.createGoDetailsPageLink();
    this.buttonsWrapper = this.createButtonsWrapper();
    this.productImage = this.createProductImage();
    this.productImageWrapper = this.createProductImageWrapper();
    this.productName = this.createProductName();
    this.productShortDescription = this.createProductShortDescription();
    this.moreButton = this.createMoreButton();
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
    this.addToCartButton = new ButtonModel({
      classes: [styles.addToCartButton],
    });

    const svg = document.createElementNS(SVG_DETAILS.SVG_URL, 'svg');
    svg.append(createSVGUse(SVG_DETAILS.CART));
    this.addToCartButton.getHTML().append(svg);

    return this.addToCartButton;
  }

  private createBottomWrapper(): HTMLDivElement {
    this.bottomWrapper = createBaseElement({
      cssClasses: [styles.bottomWrapper, 'productCardPriceWrapper'],
      tag: 'div',
    });

    observeStore(selectCurrentLanguage, () => {
      this.updateMoreButtonText(this.moreButton.getHTML());
    });

    this.moreButton
      .getHTML()
      .addEventListener('click', () => this.changeButtonText(this.productShortDescription, this.moreButton.getHTML()));

    this.bottomWrapper.append(this.productName, this.productShortDescription, this.moreButton.getHTML());
    return this.bottomWrapper;
  }

  private createButtonsWrapper(): HTMLDivElement {
    this.buttonsWrapper = createBaseElement({
      cssClasses: [styles.buttonsWrapper],
      tag: 'div',
    });

    this.buttonsWrapper.append(
      this.addToCartButton.getHTML(),
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

  private createMoreButton(): ButtonModel {
    this.moreButton = new ButtonModel({
      classes: [styles.moreButton],
      text: MORE_TEXT[getStore().getState().currentLanguage].MORE,
    });

    return this.moreButton;
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

  public getAddToCartButton(): ButtonModel {
    return this.addToCartButton;
  }

  public getBottomWrapper(): HTMLDivElement {
    return this.bottomWrapper;
  }

  public getButtonsWrapper(): HTMLDivElement {
    return this.buttonsWrapper;
  }

  public getGoDetailsPageLink(): LinkModel {
    return this.goDetailsPageLink;
  }

  public getHTML(): HTMLLIElement {
    return this.productCard;
  }

  public getMoreButton(): ButtonModel {
    return this.moreButton;
  }

  public getSwitchToWishListButton(): ButtonModel {
    return this.switchToWishListButton;
  }

  public switchStateWishListButton(hasProductInWishList: boolean): void {
    this.switchToWishListButton.getHTML().classList.toggle(styles.inWishList, hasProductInWishList);
  }
}

export default ProductCardView;
