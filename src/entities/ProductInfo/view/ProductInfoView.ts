import type { ProductInfoParams } from '@/shared/types/product';

import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import getStore from '@/shared/Store/Store.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import { LANGUAGE_CHOICE } from '@/shared/constants/common.ts';
import { PRODUCT_INFO_TEXT } from '@/shared/constants/product.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

import styles from './productInfoView.module.scss';

const SLIDER_WIDTH = 12;
const SLIDER_WIDTH_PART = 2;

class ProductInfoView {
  private basicPrice: HTMLSpanElement;

  private bigSlider: HTMLDivElement;

  private oldPrice: HTMLSpanElement;

  private params: ProductInfoParams;

  private priceWrapper: HTMLDivElement;

  private shortDescription: HTMLParagraphElement;

  private smallSlider: HTMLDivElement;

  private title: HTMLHeadingElement;

  private view: HTMLDivElement;

  constructor(params: ProductInfoParams) {
    this.params = params;
    this.title = this.createProductTitle();
    this.basicPrice = this.createBasicPrice();
    this.oldPrice = this.createOldPrice();
    this.priceWrapper = this.createPriceWrapper();
    this.shortDescription = this.createShortDescription();
    this.smallSlider = this.createSmallSlider();
    this.bigSlider = this.createBigSlider();
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

  private createBigSlider(): HTMLDivElement {
    const slider = createBaseElement({
      cssClasses: ['swiper', styles.bigSlider],
      tag: 'div',
    });

    const width = this.params.images.length * SLIDER_WIDTH + SLIDER_WIDTH_PART;
    slider.style.width = `${width}rem`;
    slider.append(this.createBigSliderWrapper());
    return slider;
  }

  private createBigSliderSlideContent(src: string, alt: string): HTMLImageElement {
    const slide = createBaseElement({
      attributes: {
        alt,
        src,
      },
      cssClasses: [styles.bigSliderImage],
      tag: 'img',
    });

    return slide;
  }

  private createBigSliderWrapper(): HTMLDivElement {
    const sliderWrapper = createBaseElement({
      cssClasses: ['swiper-wrapper', styles.bigSliderWrapper],
      tag: 'div',
    });

    this.params.images.forEach((image) => {
      const slideWrapper = createBaseElement({
        cssClasses: ['swiper-slide', styles.bigSliderSlide],
        tag: 'div',
      });
      const slide = this.createBigSliderSlideContent(image, this.params.name[0].value);
      slideWrapper.append(slide);
      sliderWrapper.append(slideWrapper);
    });

    return sliderWrapper;
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

    leftWrapper.append(this.smallSlider, this.bigSlider);

    const rightWrapper = createBaseElement({
      cssClasses: [styles.rightWrapper],
      tag: 'div',
    });

    const shortDescriptionWrapper = createBaseElement({
      cssClasses: [styles.shortDescriptionWrapper],
      innerContent: PRODUCT_INFO_TEXT[getStore().getState().currentLanguage].SHORT_DESCRIPTION,
      tag: 'div',
    });

    observeStore(selectCurrentLanguage, () => {
      const text = PRODUCT_INFO_TEXT[getStore().getState().currentLanguage].SHORT_DESCRIPTION;
      const textNode = [...shortDescriptionWrapper.childNodes].find((child) => child.nodeType === Node.TEXT_NODE);
      if (textNode) {
        textNode.textContent = text;
      }
    });

    shortDescriptionWrapper.append(this.shortDescription);
    rightWrapper.append(this.title, this.priceWrapper, shortDescriptionWrapper);

    if (this.params.currentSize) {
      rightWrapper.append(this.createSizesWrapper());
    }

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

  private createProductTitle(): HTMLHeadingElement {
    this.title = createBaseElement({
      cssClasses: [styles.title],
      innerContent: this.params.name[Number(getStore().getState().currentLanguage === LANGUAGE_CHOICE.RU)].value,
      tag: 'h3',
    });

    observeStore(selectCurrentLanguage, () => {
      const textContent = this.params.name[Number(getStore().getState().currentLanguage === LANGUAGE_CHOICE.RU)].value;
      this.title.textContent = textContent;
    });

    return this.title;
  }

  private createShortDescription(): HTMLParagraphElement {
    this.shortDescription = createBaseElement({
      cssClasses: [styles.shortDescription],
      innerContent: this.params.description[Number(getStore().getState().currentLanguage === LANGUAGE_CHOICE.RU)].value,
      tag: 'p',
    });

    observeStore(selectCurrentLanguage, () => {
      const textContent =
        this.params.description[Number(getStore().getState().currentLanguage === LANGUAGE_CHOICE.RU)].value;
      this.shortDescription.textContent = textContent;
    });
    return this.shortDescription;
  }

  private createSizeButton(size: string): ButtonModel {
    const button = new ButtonModel({
      classes: [styles.sizeButton],
      text: size,
    });
    if (size === this.params.currentSize) {
      button.setDisabled();
      button.getHTML().classList.add(styles.selected);
    }
    return button;
  }

  private createSizesWrapper(): HTMLDivElement {
    const sizesWrapper = createBaseElement({
      cssClasses: [styles.sizesWrapper],
      innerContent: PRODUCT_INFO_TEXT[getStore().getState().currentLanguage].SIZE,
      tag: 'div',
    });

    this.params.variant.forEach(({ size }) => {
      if (size) {
        sizesWrapper.append(this.createSizeButton(size).getHTML());
      }
    });

    observeStore(selectCurrentLanguage, () => {
      const text = PRODUCT_INFO_TEXT[getStore().getState().currentLanguage].SIZE;
      const textNode = [...sizesWrapper.childNodes].find((child) => child.nodeType === Node.TEXT_NODE);
      if (textNode) {
        textNode.textContent = text;
      }
    });

    return sizesWrapper;
  }

  private createSmallSlider(): HTMLDivElement {
    const slider = createBaseElement({
      cssClasses: ['swiper', styles.smallSlider],
      tag: 'div',
    });

    const maxHeight = this.params.images.length * SLIDER_WIDTH;
    slider.style.maxHeight = `${maxHeight}rem`;

    slider.append(this.createSmallSliderWrapper());
    return slider;
  }

  private createSmallSliderSlideContent(src: string, alt: string): HTMLImageElement {
    const slide = createBaseElement({
      attributes: {
        alt,
        src,
      },
      cssClasses: [styles.smallSliderImage],
      tag: 'img',
    });
    return slide;
  }

  private createSmallSliderWrapper(): HTMLDivElement {
    const sliderWrapper = createBaseElement({
      cssClasses: ['swiper-wrapper', styles.smallSliderWrapper],
      tag: 'div',
    });

    this.params.images.forEach((image) => {
      const slideWrapper = createBaseElement({
        cssClasses: ['swiper-slide', styles.smallSliderSlide],
        tag: 'div',
      });

      const slide = this.createSmallSliderSlideContent(image, this.params.name[0].value);
      slideWrapper.append(slide);
      sliderWrapper.append(slideWrapper);
    });

    return sliderWrapper;
  }

  public getBigSlider(): HTMLDivElement {
    return this.bigSlider;
  }

  public getHTML(): HTMLDivElement {
    return this.view;
  }

  public getSmallSlider(): HTMLDivElement {
    return this.smallSlider;
  }
}

export default ProductInfoView;
