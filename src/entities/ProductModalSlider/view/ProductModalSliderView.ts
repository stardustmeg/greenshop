import type { ProductInfoParams } from '@/shared/types/product';

import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import modal from '@/shared/Modal/model/ModalModel.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

import styles from './productModalSliderView.module.scss';

const BIG_SLIDER_WIDTH = 40;
const CLOSE_BUTTON_CONTENT = 'x';

class ProductModalSliderView {
  private modalCloseButton: ButtonModel;

  private modalSlider: HTMLDivElement;

  private nextSlideButton: ButtonModel;

  private params: ProductInfoParams;

  private prevSlideButton: ButtonModel;

  private view: HTMLDivElement;

  constructor(params: ProductInfoParams) {
    this.params = params;
    this.nextSlideButton = this.createNextSlideButton();
    this.prevSlideButton = this.createPrevSlideButton();
    this.modalSlider = this.createModalSlider();
    this.modalCloseButton = this.createModalCloseButton();
    this.view = this.createHTML();
  }

  private createHTML(): HTMLDivElement {
    this.view = createBaseElement({
      cssClasses: [styles.modalSlidersWrapper],
      tag: 'div',
    });

    this.view.append(this.modalSlider, this.modalCloseButton.getHTML());

    if (this.params.images.length > 1) {
      const navigationWrapper = this.createNavigationWrapper();
      navigationWrapper.append(this.prevSlideButton.getHTML(), this.nextSlideButton.getHTML());
      this.view.append(navigationWrapper);
    }
    return this.view;
  }

  private createModalCloseButton(): ButtonModel {
    this.modalCloseButton = new ButtonModel({
      classes: [styles.modalCloseButton],
      text: CLOSE_BUTTON_CONTENT,
    });

    this.modalCloseButton.getHTML().addEventListener('click', () => modal.hide());
    return this.modalCloseButton;
  }

  private createModalSlider(): HTMLDivElement {
    const slider = createBaseElement({
      cssClasses: ['swiper', styles.modalSlider],
      tag: 'div',
    });

    const maxWidth = BIG_SLIDER_WIDTH;
    slider.style.maxWidth = `${maxWidth}rem`;

    slider.append(this.createModalSliderWrapper());
    return slider;
  }

  private createModalSliderSlideContent(src: string, alt: string): HTMLImageElement {
    const slide = createBaseElement({
      attributes: {
        alt,
        src,
      },
      cssClasses: [styles.modalSliderImage],
      tag: 'img',
    });
    return slide;
  }

  private createModalSliderWrapper(): HTMLDivElement {
    const sliderWrapper = createBaseElement({
      cssClasses: ['swiper-wrapper', styles.modalSliderWrapper],
      tag: 'div',
    });

    this.params.images.forEach((image) => {
      const slideWrapper = createBaseElement({
        cssClasses: ['swiper-slide', styles.modalSliderSlide],
        tag: 'div',
      });

      const slide = this.createModalSliderSlideContent(image, this.params.name[0].value);
      slideWrapper.append(slide);
      sliderWrapper.append(slideWrapper);
    });

    return sliderWrapper;
  }

  private createNavigationWrapper(): HTMLDivElement {
    const navigationWrapper = createBaseElement({
      cssClasses: [styles.navigationWrapper],
      tag: 'div',
    });
    return navigationWrapper;
  }

  private createNextSlideButton(): ButtonModel {
    this.nextSlideButton = new ButtonModel({
      classes: [styles.nextSlideButton],
    });
    return this.nextSlideButton;
  }

  private createPrevSlideButton(): ButtonModel {
    this.prevSlideButton = new ButtonModel({
      classes: [styles.prevSlideButton],
    });
    return this.prevSlideButton;
  }

  public getHTML(): HTMLDivElement {
    return this.view;
  }

  public getModalSlider(): HTMLDivElement {
    return this.modalSlider;
  }

  public getNextSlideButton(): ButtonModel {
    return this.nextSlideButton;
  }

  public getPrevSlideButton(): ButtonModel {
    return this.prevSlideButton;
  }
}

export default ProductModalSliderView;
