import type { ProductInfoParams } from '@/shared/types/product';

import getCartModel from '@/shared/API/cart/model/CartModel.ts';
import getShoppingListModel from '@/shared/API/shopping-list/model/ShoppingListModel.ts';
import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import InputModel from '@/shared/Input/model/InputModel.ts';
import LoaderModel from '@/shared/Loader/model/LoaderModel.ts';
import serverMessageModel from '@/shared/ServerMessage/model/ServerMessageModel.ts';
import getStore from '@/shared/Store/Store.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import { BUTTON_TEXT } from '@/shared/constants/buttons.ts';
import { AUTOCOMPLETE_OPTION, LANGUAGE_CHOICE } from '@/shared/constants/common.ts';
import { INPUT_TYPE } from '@/shared/constants/forms.ts';
import { MESSAGE_STATUS, SERVER_MESSAGE_KEYS } from '@/shared/constants/messages.ts';
import { PRODUCT_INFO_TEXT, PRODUCT_INFO_TEXT_KEYS } from '@/shared/constants/product.ts';
import { LOADER_SIZE } from '@/shared/constants/sizes.ts';
import SVG_DETAILS from '@/shared/constants/svg.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import createSVGUse from '@/shared/utils/createSVGUse.ts';
import observeCurrentLanguage from '@/shared/utils/observeCurrentLanguage.ts';
import showErrorMessage from '@/shared/utils/userMessage.ts';

import './productInfoView.scss';

const SLIDER_WIDTH = 8;
const SLIDER_WIDTH_PART = 2;
const DELIMITER = '>';

class ProductInfoView {
  private SKUSpan: HTMLSpanElement;

  private bigSlider: HTMLDivElement;

  private bigSliderSlides: HTMLDivElement[] = [];

  private buttonsWrapper: HTMLDivElement;

  private categoriesSpan: HTMLSpanElement;

  private params: ProductInfoParams;

  private rightWrapper: HTMLDivElement;

  private shortDescription: HTMLParagraphElement;

  private sizeButtons: ButtonModel[] = [];

  private smallSlider: HTMLDivElement;

  private switchToCartButton: ButtonModel;

  private switchToWishListButton: ButtonModel;

  private title: HTMLHeadingElement;

  private view: HTMLDivElement;

  constructor(params: ProductInfoParams) {
    this.params = params;
    this.title = this.createProductTitle();
    this.shortDescription = this.createShortDescription();
    this.smallSlider = this.createSmallSlider();
    this.bigSlider = this.createBigSlider();
    this.SKUSpan = this.createSKUSpan();
    this.categoriesSpan = this.createCategoriesSpan();
    this.switchToCartButton = this.createSwitchToCartButton();
    this.switchToWishListButton = this.createSwitchToWishListButton();
    this.buttonsWrapper = this.createButtonsWrapper();
    this.rightWrapper = this.createRightWrapper();
    this.view = this.createHTML();
  }

  private createBigSlider(): HTMLDivElement {
    const slider = createBaseElement({
      cssClasses: ['swiper', 'bigSlider'],
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
      cssClasses: ['bigSliderImage'],
      tag: 'img',
    });

    return slide;
  }

  private createBigSliderWrapper(): HTMLDivElement {
    const sliderWrapper = createBaseElement({
      cssClasses: ['swiper-wrapper', 'bigSliderWrapper'],
      tag: 'div',
    });

    this.params.images.forEach((image) => {
      const slideWrapper = createBaseElement({
        cssClasses: ['swiper-slide', 'bigSliderSlide'],
        tag: 'div',
      });
      const slide = this.createBigSliderSlideContent(image, this.params.name[0].value);
      const loader = new LoaderModel(LOADER_SIZE.MEDIUM);
      loader.setAbsolutePosition();
      slideWrapper.append(slide, loader.getHTML());
      slide.classList.add('hidden');
      slide.addEventListener('load', () => {
        slide.classList.remove('hidden');
        loader.getHTML().remove();
      });
      this.bigSliderSlides.push(slide);
      slideWrapper.append(slide);
      sliderWrapper.append(slideWrapper);
    });

    return sliderWrapper;
  }

  private createButtonsWrapper(): HTMLDivElement {
    this.buttonsWrapper = createBaseElement({
      cssClasses: ['buttonsWrapper'],
      tag: 'div',
    });

    this.buttonsWrapper.append(this.switchToCartButton.getHTML(), this.switchToWishListButton.getHTML());

    return this.buttonsWrapper;
  }

  private createCategoriesSpan(): HTMLSpanElement {
    this.categoriesSpan = createBaseElement({
      cssClasses: ['categoriesSpan'],
      innerContent: PRODUCT_INFO_TEXT[getStore().getState().currentLanguage].CATEGORY,
      tag: 'span',
    });

    observeCurrentLanguage(this.categoriesSpan, PRODUCT_INFO_TEXT, PRODUCT_INFO_TEXT_KEYS.CATEGORY);

    const category =
      this.params.category[0].parent?.name[Number(getStore().getState().currentLanguage === LANGUAGE_CHOICE.RU)].value;
    const subcategory =
      this.params.category[0].name[Number(getStore().getState().currentLanguage === LANGUAGE_CHOICE.RU)].value;
    const currentCategoriesText = `${category ? `${category} ${DELIMITER} ` : ''}${subcategory}`;

    const currentCategories = createBaseElement({
      cssClasses: ['currentCategories'],
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

      const svg = document.createElementNS(SVG_DETAILS.SVG_URL, 'svg');
      svg.append(createSVGUse(SVG_DETAILS.LEAVES));
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

    leftWrapper.append(this.smallSlider, this.bigSlider);

    this.view.append(leftWrapper, this.rightWrapper);
    return this.view;
  }

  private createProductTitle(): HTMLHeadingElement {
    this.title = createBaseElement({
      cssClasses: ['productTitle'],
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
      cssClasses: ['rightWrapper', 'productDetailsPriceWrapper'],
      tag: 'div',
    });

    const shortDescriptionWrapper = createBaseElement({
      cssClasses: ['shortDescriptionWrapper'],
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

    if (this.params.level) {
      const difficultySpan = createBaseElement({
        cssClasses: ['difficultySpan'],
        innerContent: PRODUCT_INFO_TEXT[getStore().getState().currentLanguage].DIFFICULTY,
        tag: 'span',
      });

      observeCurrentLanguage(difficultySpan, PRODUCT_INFO_TEXT, PRODUCT_INFO_TEXT_KEYS.DIFFICULTY);

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

    const currentSKU = new InputModel({
      autocomplete: AUTOCOMPLETE_OPTION.ON,
      id: '',
      placeholder: '',
      type: INPUT_TYPE.TEXT,
      value: this.params.key,
    });

    currentSKU.getHTML().classList.add('currentSKU');

    const svg = document.createElementNS(SVG_DETAILS.SVG_URL, 'svg');
    svg.append(createSVGUse(SVG_DETAILS.COPY));

    svg.addEventListener('click', () => {
      window.navigator.clipboard
        .writeText(currentSKU.getValue())
        .then(() =>
          serverMessageModel.showServerMessage(
            SERVER_MESSAGE_KEYS.SUCCESSFUL_COPY_TO_CLIPBOARD,
            MESSAGE_STATUS.SUCCESS,
          ),
        )
        .catch(() => serverMessageModel.showServerMessage(SERVER_MESSAGE_KEYS.BAD_REQUEST, MESSAGE_STATUS.ERROR));
    });

    this.SKUSpan.append(currentSKU.getHTML(), svg);
    return this.SKUSpan;
  }

  private createShortDescription(): HTMLParagraphElement {
    this.shortDescription = createBaseElement({
      cssClasses: ['shortDescription'],
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
      cssClasses: ['swiper', 'smallSlider'],
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
      cssClasses: ['smallSliderImage'],
      tag: 'img',
    });
    return slide;
  }

  private createSmallSliderWrapper(): HTMLDivElement {
    const sliderWrapper = createBaseElement({
      cssClasses: ['swiper-wrapper', 'smallSliderWrapper'],
      tag: 'div',
    });

    this.params.images.forEach((image) => {
      const slideWrapper = createBaseElement({
        cssClasses: ['swiper-slide', 'smallSliderSlide'],
        tag: 'div',
      });

      const slide = this.createSmallSliderSlideContent(image, this.params.name[0].value);
      const loader = new LoaderModel(LOADER_SIZE.SMALL);
      loader.setAbsolutePosition();
      slideWrapper.append(slide, loader.getHTML());
      slide.classList.add('hidden');
      slide.addEventListener('load', () => {
        slide.classList.remove('hidden');
        loader.getHTML().remove();
      });
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

  private createSwitchToWishListButton(): ButtonModel {
    this.switchToWishListButton = new ButtonModel({
      classes: ['switchToWishListButton'],
    });

    const svg = document.createElementNS(SVG_DETAILS.SVG_URL, 'svg');
    svg.append(createSVGUse(SVG_DETAILS.FILL_HEART));
    this.switchToWishListButton.getHTML().append(svg);

    this.hasProductInWishList();

    return this.switchToWishListButton;
  }

  private hasProductInToCart(): void {
    getCartModel()
      .getCart()
      .then((cart) => {
        if (
          cart.products.find((product) => product.key === this.params.key && product.size === this.params.currentSize)
        ) {
          this.switchToCartButton.getHTML().textContent =
            BUTTON_TEXT[getStore().getState().currentLanguage].DELETE_PRODUCT;
        } else {
          this.switchToCartButton.getHTML().textContent =
            BUTTON_TEXT[getStore().getState().currentLanguage].ADD_PRODUCT;
        }
      })
      .catch(showErrorMessage);
  }

  private hasProductInWishList(): void {
    getShoppingListModel()
      .getShoppingList()
      .then((shoppingList) => {
        const result = shoppingList.products.find((product) => product.productId === this.params.id);
        this.switchStateWishListButton(Boolean(result));
      })
      .catch(showErrorMessage);
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

  public getSizeButtons(): ButtonModel[] {
    return this.sizeButtons;
  }

  public getSmallSlider(): HTMLDivElement {
    return this.smallSlider;
  }

  public getSwitchToCartButton(): ButtonModel {
    return this.switchToCartButton;
  }

  public getSwitchToWishListButton(): ButtonModel {
    return this.switchToWishListButton;
  }

  public switchStateWishListButton(hasProductInWishList: boolean): void {
    this.switchToWishListButton.getHTML().classList.toggle('inWishList', hasProductInWishList);
  }

  public switchToCartButtonText(hasCart: boolean): void {
    if (hasCart) {
      this.switchToCartButton.getHTML().textContent = BUTTON_TEXT[getStore().getState().currentLanguage].DELETE_PRODUCT;
    } else {
      this.switchToCartButton.getHTML().textContent = BUTTON_TEXT[getStore().getState().currentLanguage].ADD_PRODUCT;
    }
  }

  public updateParams(params: ProductInfoParams): void {
    this.params = params;
    this.hasProductInToCart();
  }
}

export default ProductInfoView;
