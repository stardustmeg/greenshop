import type { ProductInfoParams } from '@/shared/types/product.ts';

import RouterModel from '@/app/Router/model/RouterModel.ts';
import { SEARCH_PARAMS_FIELD } from '@/shared/constants/product.ts';
import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/bundle';
import 'swiper/css/navigation';
import { Autoplay, Keyboard, Navigation, Thumbs } from 'swiper/modules';

import ProductModalSliderView from '../view/ProductModalSliderView.ts';

const SLIDER_DELAY = 5000;
const SLIDER_PER_VIEW = 1;

class ProductModalSliderModel {
  private modalSlider: Swiper | null = null;

  private view: ProductModalSliderView;

  constructor(params: ProductInfoParams) {
    this.view = new ProductModalSliderView(params);
    this.init();
  }

  private init(): void {
    this.modalSlider = new Swiper(this.view.getModalSlider(), {
      autoplay: {
        delay: SLIDER_DELAY,
      },
      direction: 'horizontal',
      keyboard: {
        enabled: true,
      },
      loop: true,
      modules: [Autoplay, Thumbs, Navigation, Keyboard],
      navigation: {
        nextEl: this.view.getNextSlideButton().getHTML(),
        prevEl: this.view.getPrevSlideButton().getHTML(),
      },
      slidesPerView: SLIDER_PER_VIEW,
    });
    this.modalSlider.slideTo(Number(RouterModel.getSearchParams().get(SEARCH_PARAMS_FIELD.SLIDE)) - 1);

    this.nextSlideButtonHandler();
    this.prevSlideButtonHandler();
  }

  private nextSlideButtonHandler(): void {
    const nextSlideButton = this.view.getNextSlideButton();
    nextSlideButton.getHTML().addEventListener('click', () => {
      const slideInSearch = Number(RouterModel.getSearchParams().get(SEARCH_PARAMS_FIELD.SLIDE));

      if (slideInSearch < this.view.getModalSliderSlides().length) {
        RouterModel.setSearchParams(SEARCH_PARAMS_FIELD.SLIDE, String(slideInSearch + 1));
      } else {
        RouterModel.setSearchParams(SEARCH_PARAMS_FIELD.SLIDE, String(1));
      }
    });
  }

  private prevSlideButtonHandler(): void {
    const prevSlideButton = this.view.getPrevSlideButton();
    prevSlideButton.getHTML().addEventListener('click', () => {
      const slideInSearch = Number(RouterModel.getSearchParams().get(SEARCH_PARAMS_FIELD.SLIDE));

      if (slideInSearch > 1) {
        RouterModel.setSearchParams(SEARCH_PARAMS_FIELD.SLIDE, String(slideInSearch - 1));
      } else {
        RouterModel.setSearchParams(SEARCH_PARAMS_FIELD.SLIDE, String(this.view.getModalSliderSlides().length));
      }
    });
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }

  public getModalSlider(): Swiper | null {
    return this.modalSlider;
  }
}

export default ProductModalSliderModel;
