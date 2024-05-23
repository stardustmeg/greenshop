import type { ProductInfoParams } from '@/shared/types/product.ts';

import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/bundle';
import 'swiper/css/navigation';
import { Autoplay, Navigation, Thumbs } from 'swiper/modules';

import ProductModalSliderView from '../view/ProductModalSliderView.ts';

const SLIDER_DELAY = 5000;
const SLIDER_PER_VIEW = 1;

class ProductModalSliderModel {
  private view: ProductModalSliderView;

  constructor(params: ProductInfoParams) {
    this.view = new ProductModalSliderView(params);
    this.init();
  }

  private init(): void {
    const modalSlider = new Swiper(this.view.getModalSlider(), {
      autoplay: {
        delay: SLIDER_DELAY,
      },
      direction: 'horizontal',
      loop: true,
      modules: [Autoplay, Thumbs, Navigation],
      navigation: {
        nextEl: this.view.getNextSlideButton().getHTML(),
        prevEl: this.view.getPrevSlideButton().getHTML(),
      },
      slidesPerView: SLIDER_PER_VIEW,
    });
    modalSlider.autoplay.start();
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default ProductModalSliderModel;
