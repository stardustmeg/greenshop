import type { ProductInfoParams } from '@/shared/types/product.ts';

import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/bundle';
import 'swiper/css/autoplay';
import { Autoplay, Thumbs } from 'swiper/modules';

import ProductInfoView from '../view/ProductInfoView.ts';

const SLIDER_DELAY = 5000;
const SLIDER_PER_VIEW = 1;

class ProductInfoModel {
  private bigSlider: Swiper | null = null;

  private smallSlider: Swiper | null = null;

  private view: ProductInfoView;

  constructor(params: ProductInfoParams) {
    this.view = new ProductInfoView(params);
    this.init(params);
  }

  private init(params: ProductInfoParams): void {
    this.smallSlider = new Swiper(this.view.getSmallSlider(), {
      direction: 'vertical',
      slidesPerView: params.images.length,
    });
    this.bigSlider = new Swiper(this.view.getBigSlider(), {
      autoplay: {
        delay: SLIDER_DELAY,
      },
      direction: 'vertical',
      loop: true,
      modules: [Autoplay, Thumbs],
      slidesPerView: SLIDER_PER_VIEW,
      thumbs: {
        swiper: this.smallSlider,
      },
    });
    this.bigSlider.autoplay.start();
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default ProductInfoModel;
