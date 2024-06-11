import type { User } from '@/shared/types/user';

import getCustomerModel from '@/shared/API/customer/model/CustomerModel.ts';
import InputModel from '@/shared/Input/model/InputModel.ts';
import getStore from '@/shared/Store/Store.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import PROMO_SLIDER_CONTENT from '@/shared/constants/promo.ts';
import SVG_DETAILS from '@/shared/constants/svg.ts';
import calcUserBirthDayRange from '@/shared/utils/calcUserBirthDayRange.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import createSVGUse from '@/shared/utils/createSVGUse.ts';
import getCurrentLanguage from '@/shared/utils/getCurrentLanguage.ts';
import { promoCodeCopiedMessage } from '@/shared/utils/messageTemplates.ts';
import { showErrorMessage, showSuccessMessage } from '@/shared/utils/userMessage.ts';

import styles from './promoCodeSliderView.module.scss';

class PromoCodeSliderView {
  private paginationWrapper: HTMLDivElement;

  private slider: HTMLDivElement;

  private view: HTMLDivElement;

  constructor() {
    this.paginationWrapper = this.createPaginationWrapper();
    this.slider = this.createSlider();
    this.view = this.createHTML();
  }

  private createDateSpan(index: number, currentUser?: User): HTMLSpanElement {
    const date = createBaseElement({
      cssClasses: [styles.sliderDate],
      tag: 'span',
    });

    const start = createBaseElement({
      cssClasses: [styles.sliderDateStart],
      innerContent: ((): string => {
        const promoContent = PROMO_SLIDER_CONTENT[index][getCurrentLanguage()].date;
        if (currentUser) {
          return `${calcUserBirthDayRange(currentUser.birthDate).start} &mdash;`;
        }
        if (promoContent.end) {
          return `${promoContent.start} &mdash;`;
        }
        return promoContent.start;
      })(),
      tag: 'span',
    });

    const end = createBaseElement({
      cssClasses: [styles.sliderDateEnd],
      innerContent: currentUser
        ? calcUserBirthDayRange(currentUser.birthDate).end
        : PROMO_SLIDER_CONTENT[index][getCurrentLanguage()].date.end ?? '',
      tag: 'span',
    });

    observeStore(selectCurrentLanguage, () => {
      if (currentUser) {
        start.innerHTML = getStore().getState().isUserLoggedIn
          ? `${calcUserBirthDayRange(currentUser.birthDate).start} &mdash;`
          : PROMO_SLIDER_CONTENT[index][getCurrentLanguage()].date.start;
        end.textContent = getStore().getState().isUserLoggedIn ? calcUserBirthDayRange(currentUser.birthDate).end : '';
      } else {
        start.innerHTML = PROMO_SLIDER_CONTENT[index][getCurrentLanguage()].date.start;
        end.textContent = PROMO_SLIDER_CONTENT[index][getCurrentLanguage()].date.end ?? '';
      }
    });

    date.append(start, end);
    return date;
  }

  private createHTML(): HTMLDivElement {
    this.view = createBaseElement({
      cssClasses: [styles.wrapper],
      tag: 'div',
    });

    this.view.append(this.slider);
    return this.view;
  }

  private createPaginationWrapper(): HTMLDivElement {
    this.paginationWrapper = createBaseElement({
      cssClasses: [styles.paginationWrapper],
      tag: 'div',
    });

    return this.paginationWrapper;
  }

  private createPromoCodeSpan(code: string): HTMLSpanElement {
    const promoCode = createBaseElement({
      cssClasses: [styles.sliderPromoCode],
      tag: 'span',
    });

    const currentPromoCode = new InputModel({ value: code });

    currentPromoCode.getHTML().classList.add(styles.currentPromoCode);

    const svg = document.createElementNS(SVG_DETAILS.SVG_URL, 'svg');
    svg.append(createSVGUse(SVG_DETAILS.COPY));

    svg.addEventListener('click', () => {
      window.navigator.clipboard
        .writeText(currentPromoCode.getValue())
        .then(() => showSuccessMessage(promoCodeCopiedMessage(currentPromoCode.getValue())))
        .catch(showErrorMessage);
    });

    promoCode.append(svg, currentPromoCode.getHTML());
    return promoCode;
  }

  private createSlider(): HTMLDivElement {
    this.slider = createBaseElement({
      cssClasses: ['swiper', styles.slider],
      tag: 'div',
    });

    this.slider.append(this.createSliderWrapper(), this.paginationWrapper);

    return this.slider;
  }

  private async createSliderSlideContent(index: number): Promise<HTMLDivElement> {
    const slide = createBaseElement({
      cssClasses: [styles.sliderContent],
      tag: 'div',
    });
    slide.classList.add(styles[PROMO_SLIDER_CONTENT[index][getCurrentLanguage()].style]);
    const { description, title } = this.createSliderSlideInfo(index);

    slide.append(
      title,
      description,
      this.createPromoCodeSpan(PROMO_SLIDER_CONTENT[index][getCurrentLanguage()].promoCode),
    );

    observeStore(selectCurrentLanguage, () => {
      title.innerHTML = PROMO_SLIDER_CONTENT[index][getCurrentLanguage()].title;
      description.innerHTML = PROMO_SLIDER_CONTENT[index][getCurrentLanguage()].description;
    });

    if (PROMO_SLIDER_CONTENT[index].en.date.end === null && getStore().getState().isUserLoggedIn) {
      const currentUser = await getCustomerModel().getCurrentUser();
      if (currentUser) {
        slide.append(this.createDateSpan(index, currentUser));
      }
    } else {
      slide.append(this.createDateSpan(index));
    }

    return slide;
  }

  private createSliderSlideInfo(index: number): {
    description: HTMLParagraphElement;
    title: HTMLHeadingElement;
  } {
    const title = createBaseElement({
      cssClasses: [styles.sliderTitle],
      innerContent: PROMO_SLIDER_CONTENT[index][getCurrentLanguage()].title,
      tag: 'h3',
    });

    const description = createBaseElement({
      cssClasses: [styles.sliderDescription],
      innerContent: PROMO_SLIDER_CONTENT[index][getCurrentLanguage()].description,
      tag: 'p',
    });

    return { description, title };
  }

  private createSliderWrapper(): HTMLDivElement {
    const sliderWrapper = createBaseElement({
      cssClasses: ['swiper-wrapper', styles.sliderWrapper],
      tag: 'div',
    });

    PROMO_SLIDER_CONTENT.forEach((_, index) => {
      const slideWrapper = createBaseElement({
        cssClasses: ['swiper-slide', styles.sliderSlide],
        tag: 'div',
      });
      this.createSliderSlideContent(index)
        .then((slide) => slideWrapper.append(slide))
        .catch(showErrorMessage);

      sliderWrapper.append(slideWrapper);
    });

    return sliderWrapper;
  }

  public getHTML(): HTMLDivElement {
    return this.view;
  }

  public getPaginationWrapper(): HTMLDivElement {
    return this.paginationWrapper;
  }

  public getSlider(): HTMLDivElement {
    return this.slider;
  }

  public redrawSlider(): void {
    this.slider.innerHTML = '';
    this.slider.append(this.createSliderWrapper());
  }
}

export default PromoCodeSliderView;
