import type ProductCardParams from '@/shared/types/productCard.ts';

import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import LoaderModel from '@/shared/Loader/model/LoaderModel.ts';
import getStore from '@/shared/Store/Store.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import { MORE_TEXT } from '@/shared/constants/buttons.ts';
import { SIZES } from '@/shared/constants/sizes.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

import styles from './productCardView.module.scss';

class ProductCardView {
  private params: ProductCardParams;

  private productCard: HTMLLIElement;

  private productImage: HTMLImageElement;

  private productImageWrapper: HTMLDivElement;

  private productName: HTMLHeadingElement;

  private productShortDescription: HTMLParagraphElement;

  constructor(params: ProductCardParams) {
    this.params = params;
    this.productImage = this.createProductImage();
    this.productImageWrapper = this.createProductImageWrapper();
    this.productName = this.createProductName();
    this.productShortDescription = this.createProductShortDescription();
    this.productCard = this.createHTML();
  }

  private changeButtonText(productShortDescription: HTMLParagraphElement, moreButton: HTMLButtonElement): void {
    const { currentLanguage } = getStore().getState();
    const moreText = MORE_TEXT[currentLanguage];
    const button = moreButton;

    productShortDescription.classList.toggle(styles.active);
    button.textContent = button.textContent === moreText.HIDE ? moreText.MORE : moreText.HIDE;
  }

  private createHTML(): HTMLLIElement {
    this.productCard = createBaseElement({
      cssClasses: [styles.productCard],
      tag: 'li',
    });

    this.productCard.append(this.productImageWrapper, this.productName, this.productShortDescription);
    return this.productCard;
  }

  private createMoreButton(): HTMLButtonElement {
    const moreButton = new ButtonModel({
      classes: [styles.moreButton],
      text: MORE_TEXT[getStore().getState().currentLanguage].MORE,
    });

    return moreButton.getHTML();
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

  private createProductName(): HTMLHeadingElement {
    const productName = createBaseElement({
      cssClasses: [styles.productName],
      innerContent: this.params.name[0].value,
      tag: 'h3',
    });
    return productName;
  }

  private createProductShortDescription(): HTMLParagraphElement {
    const productShortDescription = createBaseElement({
      cssClasses: [styles.productShortDescription],
      innerContent: this.params.description[0].value,
      tag: 'p',
    });

    const moreButton = this.createMoreButton();
    productShortDescription.append(moreButton);

    observeStore(selectCurrentLanguage, () => {
      this.updateMoreButtonText(moreButton);
    });

    moreButton.addEventListener('click', () => this.changeButtonText(productShortDescription, moreButton));

    return productShortDescription;
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
