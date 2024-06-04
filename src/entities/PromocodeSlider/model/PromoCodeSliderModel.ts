import observeStore, { selectIsUserLoggedIn } from '@/shared/Store/observer.ts';
import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/bundle';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';

import PromoCodeSliderView from '../view/PromoCodeSliderView.ts';

const SLIDER_DELAY = 1000000000;
const SLIDER_PER_VIEW = 1;

class PromoCodeSliderModel {
  private slider: Swiper | null = null;

  private view: PromoCodeSliderView;

  constructor() {
    this.view = new PromoCodeSliderView();
    this.init();
  }

  private init(): void {
    this.initSlider();

    observeStore(selectIsUserLoggedIn, () => this.view.redrawSlider());
  }

  private initSlider(): void {
    this.slider = new Swiper(this.view.getSlider(), {
      autoplay: {
        delay: SLIDER_DELAY,
      },
      direction: 'horizontal',
      loop: true,
      modules: [Autoplay, Pagination],
      pagination: {
        clickable: true,
        el: this.view.getPaginationWrapper(),
      },
      slidesPerView: SLIDER_PER_VIEW,
    });
    this.slider.autoplay.start();
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default PromoCodeSliderModel;
