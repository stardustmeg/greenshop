import type { ProductInfoParams } from '@/shared/types/product';

import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import getStore from '@/shared/Store/Store.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import { LANGUAGE_CHOICE } from '@/shared/constants/common.ts';
import { PRODUCT_INFO_TEXT } from '@/shared/constants/product.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

import styles from './productInfoView.module.scss';

const SLIDER_WIDTH = 8;
const SLIDER_WIDTH_PART = 2;

class ProductInfoView {
  private SCUSpan: HTMLSpanElement;

  private bigSlider: HTMLDivElement;

  private bigSliderSlides: HTMLDivElement[] = [];

  private categoriesSpan: HTMLSpanElement;

  private params: ProductInfoParams;

  private rightWrapper: HTMLDivElement;

  private shortDescription: HTMLParagraphElement;

  private smallSlider: HTMLDivElement;

  private title: HTMLHeadingElement;

  private view: HTMLDivElement;

  constructor(params: ProductInfoParams) {
    this.params = params;
    this.title = this.createProductTitle();
    this.shortDescription = this.createShortDescription();
    this.smallSlider = this.createSmallSlider();
    this.bigSlider = this.createBigSlider();
    this.SCUSpan = this.createSCUSpan();
    this.categoriesSpan = this.createCategoriesSpan();
    this.rightWrapper = this.createRightWrapper();
    this.view = this.createHTML();
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
      this.bigSliderSlides.push(slide);
      slideWrapper.append(slide);
      sliderWrapper.append(slideWrapper);
    });

    return sliderWrapper;
  }

  private createCategoriesSpan(): HTMLSpanElement {
    this.categoriesSpan = createBaseElement({
      cssClasses: [styles.categoriesSpan],
      innerContent: 'Categories: ',
      tag: 'span',
    });

    const category =
      this.params.category[0].parent?.name[Number(getStore().getState().currentLanguage === LANGUAGE_CHOICE.RU)].value;
    const subcategory =
      this.params.category[0].name[Number(getStore().getState().currentLanguage === LANGUAGE_CHOICE.RU)].value;
    const currentCategoriesText = `${category ? `${category} > ` : ''}${subcategory}`;

    const currentCategories = createBaseElement({
      cssClasses: [styles.currentCategories],
      innerContent: currentCategoriesText,
      tag: 'span',
    });
    this.categoriesSpan.append(currentCategories);

    observeStore(selectCurrentLanguage, () => {
      const category =
        this.params.category[0].parent?.name[Number(getStore().getState().currentLanguage === LANGUAGE_CHOICE.RU)]
          .value;
      const subcategory =
        this.params.category[0].name[Number(getStore().getState().currentLanguage === LANGUAGE_CHOICE.RU)].value;
      const currentCategoriesText = `${category ? `${category} > ` : ''}${subcategory}`;

      currentCategories.textContent = currentCategoriesText;
    });
    return this.categoriesSpan;
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

    this.view.append(leftWrapper, this.rightWrapper);
    return this.view;
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

  private createRightWrapper(): HTMLDivElement {
    this.rightWrapper = createBaseElement({
      cssClasses: [styles.rightWrapper, 'productDetailsPriceWrapper'],
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
    this.rightWrapper.append(this.title, shortDescriptionWrapper);

    if (this.params.variant.some(({ size }) => size)) {
      this.rightWrapper.append(this.createSizesWrapper());
    }

    this.rightWrapper.append(this.SCUSpan, this.categoriesSpan);
    return this.rightWrapper;
  }

  private createSCUSpan(): HTMLSpanElement {
    this.SCUSpan = createBaseElement({
      cssClasses: [styles.SCUSpan],
      innerContent: 'SCU: ',
      tag: 'span',
    });

    const currentSCU = createBaseElement({
      cssClasses: [styles.currentSCU],
      innerContent: this.params.key,
      tag: 'span',
    });

    this.SCUSpan.append(currentSCU);
    return this.SCUSpan;
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
    if (this.params.currentSize === size) {
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

  public getBigSliderSlides(): HTMLDivElement[] {
    return this.bigSliderSlides;
  }

  public getHTML(): HTMLDivElement {
    return this.view;
  }

  public getRightWrapper(): HTMLDivElement {
    return this.rightWrapper;
  }

  public getSmallSlider(): HTMLDivElement {
    return this.smallSlider;
  }
}

export default ProductInfoView;
