import type { ProductInfoParams } from '@/shared/types/product';

import getCartModel from '@/shared/API/cart/model/CartModel.ts';
import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import InputModel from '@/shared/Input/model/InputModel.ts';
import LoaderModel from '@/shared/Loader/model/LoaderModel.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import { BUTTON_TEXT } from '@/shared/constants/buttons.ts';
import { PRODUCT_INFO_TEXT, PRODUCT_INFO_TEXT_KEY } from '@/shared/constants/product.ts';
import { LOADER_SIZE } from '@/shared/constants/sizes.ts';
import SVG_DETAIL from '@/shared/constants/svg.ts';
import { DIFFICULTY } from '@/shared/types/product.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import createSVGUse from '@/shared/utils/createSVGUse.ts';
import getCurrentLanguage from '@/shared/utils/getCurrentLanguage.ts';
import getLanguageValue from '@/shared/utils/getLanguageValue.ts';
import { SKUCopiedMessage } from '@/shared/utils/messageTemplates.ts';
import observeCurrentLanguage from '@/shared/utils/observeCurrentLanguage.ts';
import { showErrorMessage, showSuccessMessage } from '@/shared/utils/userMessage.ts';

import './productInfoView.scss';

const DELIMITER = '>';

class ProductInfoView {
  private SKUSpan: HTMLSpanElement;

  private buttonsWrapper: HTMLDivElement;

  private categoriesSpan: HTMLSpanElement;

  private nextSlideButton: ButtonModel;

  private params: ProductInfoParams;

  private prevSlideButton: ButtonModel;

  private rightWrapper: HTMLDivElement;

  private shortDescription: HTMLParagraphElement;

  private sizeButtons: ButtonModel[] = [];

  private slider: HTMLDivElement;

  private sliderSlides: HTMLDivElement[] = [];

  private switchToCartButton: ButtonModel;

  private title: HTMLHeadingElement;

  private view: HTMLDivElement;

  constructor(params: ProductInfoParams) {
    this.params = params;
    this.title = this.createProductTitle();
    this.shortDescription = this.createShortDescription();
    this.nextSlideButton = this.createNextSlideButton();
    this.prevSlideButton = this.createPrevSlideButton();
    this.slider = this.createSlider();
    this.SKUSpan = this.createSKUSpan();
    this.categoriesSpan = this.createCategoriesSpan();
    this.switchToCartButton = this.createSwitchToCartButton();
    this.buttonsWrapper = this.createButtonsWrapper();
    this.rightWrapper = this.createRightWrapper();
    this.view = this.createHTML();
  }

  private createButtonsWrapper(): HTMLDivElement {
    this.buttonsWrapper = createBaseElement({
      cssClasses: ['buttonsWrapper'],
      tag: 'div',
    });

    this.buttonsWrapper.append(this.switchToCartButton.getHTML());

    return this.buttonsWrapper;
  }

  private createCategoriesSpan(): HTMLSpanElement {
    const currentLanguage = getCurrentLanguage();
    this.categoriesSpan = createBaseElement({
      cssClasses: ['categoriesSpan'],
      innerContent: PRODUCT_INFO_TEXT[currentLanguage].CATEGORY,
      tag: 'span',
    });

    observeCurrentLanguage(this.categoriesSpan, PRODUCT_INFO_TEXT, PRODUCT_INFO_TEXT_KEY.CATEGORY);

    const category = getLanguageValue(this.params.category[0].parent?.name || []);
    const subcategory = getLanguageValue(this.params.category[0].name);
    const currentCategoriesText = `${category ? `${category} ${DELIMITER} ` : ''}${subcategory}`;

    const currentCategories = createBaseElement({
      cssClasses: ['currentCategories'],
      innerContent: currentCategoriesText,
      tag: 'span',
    });
    this.categoriesSpan.append(currentCategories);

    observeStore(selectCurrentLanguage, () => {
      const category = getLanguageValue(this.params.category[0].parent?.name || []);
      const subcategory = getLanguageValue(this.params.category[0].name);
      const currentCategoriesText = `${category ? `${category} ${DELIMITER} ` : ''}${subcategory}`;

      currentCategories.textContent = currentCategoriesText;
    });
    return this.categoriesSpan;
  }

  private createDifficultyPoints(): HTMLSpanElement[] {
    const difficultyPoints: HTMLSpanElement[] = [];
    for (let index = 0; index < Number(this.params.level); index += 1) {
      const difficultyPoint = createBaseElement({
        cssClasses: ['difficultyPoint'],
        tag: 'span',
      });

      const svg = document.createElementNS(SVG_DETAIL.SVG_URL, 'svg');
      svg.append(createSVGUse(SVG_DETAIL.LEAVES));
      difficultyPoint.append(svg);

      difficultyPoints.push(difficultyPoint);
    }
    return difficultyPoints;
  }

  private createHTML(): HTMLDivElement {
    this.view = createBaseElement({
      cssClasses: ['wrapper'],
      tag: 'div',
    });

    const leftWrapper = createBaseElement({
      cssClasses: ['leftWrapper'],
      tag: 'div',
    });

    if (this.params.images.length > 1) {
      const navigationWrapper = this.createNavigationWrapper();
      navigationWrapper.append(this.prevSlideButton.getHTML(), this.nextSlideButton.getHTML());
      leftWrapper.append(navigationWrapper);
    }

    leftWrapper.append(this.slider);

    this.view.append(leftWrapper, this.rightWrapper);
    return this.view;
  }

  private createNavigationWrapper(): HTMLDivElement {
    const navigationWrapper = createBaseElement({
      cssClasses: ['navigationWrapper'],
      tag: 'div',
    });
    return navigationWrapper;
  }

  private createNextSlideButton(): ButtonModel {
    this.nextSlideButton = new ButtonModel({
      classes: ['nextSlideButton'],
    });

    const svg = document.createElementNS(SVG_DETAIL.SVG_URL, 'svg');
    svg.append(createSVGUse(SVG_DETAIL.ARROW_UP));
    this.nextSlideButton.getHTML().append(svg);
    return this.nextSlideButton;
  }

  private createPrevSlideButton(): ButtonModel {
    this.prevSlideButton = new ButtonModel({
      classes: ['prevSlideButton'],
    });
    const svg = document.createElementNS(SVG_DETAIL.SVG_URL, 'svg');
    svg.append(createSVGUse(SVG_DETAIL.ARROW_UP));
    this.prevSlideButton.getHTML().append(svg);
    return this.prevSlideButton;
  }

  private createProductTitle(): HTMLHeadingElement {
    this.title = createBaseElement({
      cssClasses: ['productTitle'],
      innerContent: getLanguageValue(this.params.name),
      tag: 'h3',
    });

    observeStore(selectCurrentLanguage, () => {
      const textContent = getLanguageValue(this.params.name);
      this.title.textContent = textContent;
    });

    return this.title;
  }

  private createRightWrapper(): HTMLDivElement {
    const currentLanguage = getCurrentLanguage();

    this.rightWrapper = createBaseElement({
      cssClasses: ['rightWrapper', 'productDetailsPriceWrapper', 'modalContent'],
      tag: 'div',
    });

    const shortDescriptionWrapper = createBaseElement({
      cssClasses: ['shortDescriptionWrapper'],
      innerContent: PRODUCT_INFO_TEXT[currentLanguage].SHORT_DESCRIPTION,
      tag: 'div',
    });

    observeStore(selectCurrentLanguage, () => {
      const text = PRODUCT_INFO_TEXT[getCurrentLanguage()].SHORT_DESCRIPTION;
      const textNode = [...shortDescriptionWrapper.childNodes].find((child) => child.nodeType === Node.TEXT_NODE);
      if (textNode) {
        textNode.textContent = text;
      }
    });

    if (this.params.level) {
      const difficultySpan = createBaseElement({
        cssClasses: ['difficultySpan'],
        innerContent: PRODUCT_INFO_TEXT[currentLanguage].DIFFICULTY,
        tag: 'span',
        title: DIFFICULTY[getCurrentLanguage()][this.params.level],
      });

      observeStore(selectCurrentLanguage, () => {
        difficultySpan.title = this.params.level ? DIFFICULTY[getCurrentLanguage()][this.params.level] : '';
      });
      observeCurrentLanguage(difficultySpan, PRODUCT_INFO_TEXT, PRODUCT_INFO_TEXT_KEY.DIFFICULTY);

      difficultySpan.append(...this.createDifficultyPoints());
      this.rightWrapper.append(difficultySpan);
    }

    shortDescriptionWrapper.append(this.shortDescription);
    this.rightWrapper.append(this.title, shortDescriptionWrapper);

    if (this.params.variant.some(({ size }) => size)) {
      this.rightWrapper.append(this.createSizesWrapper());
    }

    this.rightWrapper.append(this.SKUSpan, this.categoriesSpan, this.buttonsWrapper);
    return this.rightWrapper;
  }

  private createSKUSpan(): HTMLSpanElement {
    this.SKUSpan = createBaseElement({
      cssClasses: ['SKUSpan'],
      innerContent: 'SKU: ',
      tag: 'span',
    });

    const currentSKU = new InputModel({ value: this.params.key });

    currentSKU.getHTML().classList.add('currentSKU');

    const svg = document.createElementNS(SVG_DETAIL.SVG_URL, 'svg');
    svg.append(createSVGUse(SVG_DETAIL.COPY));

    svg.addEventListener('click', () => {
      window.navigator.clipboard
        .writeText(currentSKU.getValue())
        .then(() => showSuccessMessage(SKUCopiedMessage(currentSKU.getValue())))
        .catch(showErrorMessage);
    });

    this.SKUSpan.append(currentSKU.getHTML(), svg);
    return this.SKUSpan;
  }

  private createShortDescription(): HTMLParagraphElement {
    this.shortDescription = createBaseElement({
      cssClasses: ['shortDescription'],
      innerContent: getLanguageValue(this.params.description),
      tag: 'p',
    });

    observeStore(selectCurrentLanguage, () => {
      const textContent = getLanguageValue(this.params.description);
      this.shortDescription.textContent = textContent;
    });
    return this.shortDescription;
  }

  private createSizeButton(size: string): ButtonModel {
    const button = new ButtonModel({
      classes: ['sizeButton'],
      text: size,
    });
    if (this.params.currentSize === size) {
      button.setDisabled();
      button.getHTML().classList.add('selected');
    }

    button.getHTML().addEventListener('click', () => {
      this.sizeButtons.forEach((btn) => {
        btn.setEnabled();
        btn.getHTML().classList.remove('selected');
      });
      button.getHTML().classList.add('selected');
      button.setDisabled();
    });

    this.sizeButtons.push(button);
    return button;
  }

  private createSizesWrapper(): HTMLDivElement {
    const sizesWrapper = createBaseElement({
      cssClasses: ['sizesWrapper'],
      innerContent: PRODUCT_INFO_TEXT[getCurrentLanguage()].SIZE,
      tag: 'div',
    });

    this.params.variant.forEach(({ size }) => {
      if (size) {
        sizesWrapper.append(this.createSizeButton(size).getHTML());
      }
    });

    observeStore(selectCurrentLanguage, () => {
      const text = PRODUCT_INFO_TEXT[getCurrentLanguage()].SIZE;
      const textNode = [...sizesWrapper.childNodes].find((child) => child.nodeType === Node.TEXT_NODE);
      if (textNode) {
        textNode.textContent = text;
      }
    });

    return sizesWrapper;
  }

  private createSlider(): HTMLDivElement {
    const slider = createBaseElement({
      cssClasses: ['swiper', 'slider'],
      tag: 'div',
    });

    slider.append(this.createSliderWrapper());
    return slider;
  }

  private createSliderSlideContent(src: string, alt: string): HTMLImageElement {
    const slide = createBaseElement({
      attributes: {
        alt,
        src,
      },
      cssClasses: ['sliderImage'],
      tag: 'img',
    });

    return slide;
  }

  private createSliderWrapper(): HTMLDivElement {
    const sliderWrapper = createBaseElement({
      cssClasses: ['swiper-wrapper', 'sliderWrapper'],
      tag: 'div',
    });

    this.params.images.forEach((image) => {
      const slideWrapper = createBaseElement({
        cssClasses: ['swiper-slide', 'sliderSlide'],
        tag: 'div',
      });
      const slide = this.createSliderSlideContent(image, this.params.name[0].value);
      const loader = new LoaderModel(LOADER_SIZE.MEDIUM);
      loader.setAbsolutePosition();
      slideWrapper.append(slide, loader.getHTML());
      slide.classList.add('hidden');
      slide.addEventListener('load', () => {
        slide.classList.remove('hidden');
        loader.getHTML().remove();
      });
      this.sliderSlides.push(slide);
      slideWrapper.append(slide);
      sliderWrapper.append(slideWrapper);
    });

    return sliderWrapper;
  }

  private createSwitchToCartButton(): ButtonModel {
    this.switchToCartButton = new ButtonModel({
      classes: ['switchToCartButton'],
    });

    this.hasProductInToCart();
    observeStore(selectCurrentLanguage, () => this.hasProductInToCart());

    return this.switchToCartButton;
  }

  private hasProductInToCart(): void {
    getCartModel()
      .getCart()
      .then((cart) => {
        const currentLanguage = getCurrentLanguage();
        if (
          cart.products.find((product) => product.key === this.params.key && product.size === this.params.currentSize)
        ) {
          this.switchToCartButton.getHTML().textContent = BUTTON_TEXT[currentLanguage].DELETE_PRODUCT;
        } else {
          this.switchToCartButton.getHTML().textContent = BUTTON_TEXT[currentLanguage].ADD_PRODUCT;
        }
      })
      .catch(showErrorMessage);
  }

  public getButtonsWrapper(): HTMLDivElement {
    return this.buttonsWrapper;
  }

  public getHTML(): HTMLDivElement {
    return this.view;
  }

  public getNextSlideButton(): ButtonModel {
    return this.nextSlideButton;
  }

  public getPrevSlideButton(): ButtonModel {
    return this.prevSlideButton;
  }

  public getRightWrapper(): HTMLDivElement {
    return this.rightWrapper;
  }

  public getSizeButtons(): ButtonModel[] {
    return this.sizeButtons;
  }

  public getSlider(): HTMLDivElement {
    return this.slider;
  }

  public getSliderSlides(): HTMLDivElement[] {
    return this.sliderSlides;
  }

  public getSwitchToCartButton(): ButtonModel {
    return this.switchToCartButton;
  }

  public switchToCartButtonText(hasCart: boolean): void {
    const currentLanguage = getCurrentLanguage();
    if (hasCart) {
      this.switchToCartButton.getHTML().textContent = BUTTON_TEXT[currentLanguage].DELETE_PRODUCT;
    } else {
      this.switchToCartButton.getHTML().textContent = BUTTON_TEXT[currentLanguage].ADD_PRODUCT;
    }
  }

  public updateParams(params: ProductInfoParams): void {
    this.params = params;
    this.hasProductInToCart();
  }
}

export default ProductInfoView;
