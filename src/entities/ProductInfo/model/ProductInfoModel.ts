import type { ProductInfoParams } from '@/shared/types/product.ts';

import ProductModalSliderModel from '@/entities/ProductModalSlider/model/ProductModalSliderModel.ts';
import ProductPriceModel from '@/entities/ProductPrice/model/ProductPriceModel.ts';
import modal from '@/shared/Modal/model/ModalModel.ts';
import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/bundle';
import { Autoplay, Thumbs } from 'swiper/modules';

import ProductInfoView from '../view/ProductInfoView.ts';

const SLIDER_DELAY = 5000;
const SLIDER_PER_VIEW = 1;

class ProductInfoModel {
  private bigSlider: Swiper | null = null;

  private price: ProductPriceModel;

  private smallSlider: Swiper | null = null;

  private view: ProductInfoView;

  constructor(params: ProductInfoParams) {
    this.view = new ProductInfoView(params);
    const currentVariant = params.variant.find(({ size }) => size === params.currentSize) ?? params.variant[0];
    this.price = new ProductPriceModel(currentVariant);
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

    const modalSlider = new ProductModalSliderModel(params).getHTML();

    this.view.getBigSliderSlides().forEach((slide) => {
      slide.addEventListener('click', () => {
        modal.show();
        modal.setContent(modalSlider);
      });
    });

    this.view.getRightWrapper().append(this.price.getHTML());
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default ProductInfoModel;
