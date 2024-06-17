import type { User } from '@/shared/types/user';

import getCustomerModel from '@/shared/API/customer/model/CustomerModel.ts';
import InputModel from '@/shared/Input/model/InputModel.ts';
import getStore from '@/shared/Store/Store.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import PROMO_SLIDER_CONTENT from '@/shared/constants/promo.ts';
import SVG_DETAIL from '@/shared/constants/svg.ts';
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
    const currentLanguage = getCurrentLanguage();
    const date = createBaseElement({
      cssClasses: [styles.sliderDate],
      tag: 'span',
    });

    const start = createBaseElement({
      cssClasses: [styles.sliderDateStart],
      innerContent: ((): string => {
        const promoContent = PROMO_SLIDER_CONTENT[index][currentLanguage].date;
        if (currentUser) {
          return `${calcUserBirthDayRange(currentUser.birthDate).start} —`;
        }
        if (promoContent.end) {
          return `${promoContent.start} —`;
        }
        return promoContent.start;
      })(),
      tag: 'span',
    });

    const end = createBaseElement({
      cssClasses: [styles.sliderDateEnd],
      innerContent: currentUser
        ? calcUserBirthDayRange(currentUser.birthDate).end
        : PROMO_SLIDER_CONTENT[index][currentLanguage].date.end ?? '',
      tag: 'span',
    });

    this.observeLanguageChanges(start, end, index, currentUser);

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

    const svg = document.createElementNS(SVG_DETAIL.SVG_URL, 'svg');
    svg.append(createSVGUse(SVG_DETAIL.COPY));

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
    const currentLanguage = getCurrentLanguage();
    const slide = createBaseElement({
      cssClasses: [styles.sliderContent],
      tag: 'div',
    });
    slide.classList.add(styles[PROMO_SLIDER_CONTENT[index][currentLanguage].style]);
    const { description, title } = this.createSliderSlideInfo(index);

    slide.append(title, description, this.createPromoCodeSpan(PROMO_SLIDER_CONTENT[index][currentLanguage].promoCode));

    observeStore(selectCurrentLanguage, () => {
      const currentLanguage = getCurrentLanguage();
      title.innerHTML = PROMO_SLIDER_CONTENT[index][currentLanguage].title;
      description.innerHTML = PROMO_SLIDER_CONTENT[index][currentLanguage].description;
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
    const currentLanguage = getCurrentLanguage();
    const title = createBaseElement({
      cssClasses: [styles.sliderTitle],
      innerContent: PROMO_SLIDER_CONTENT[index][currentLanguage].title,
      tag: 'h3',
    });

    const description = createBaseElement({
      cssClasses: [styles.sliderDescription],
      innerContent: PROMO_SLIDER_CONTENT[index][currentLanguage].description,
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

  private observeLanguageChanges(
    startSpan: HTMLSpanElement,
    endSpan: HTMLSpanElement,
    index: number,
    currentUser?: User,
  ): void {
    const start = startSpan;
    const end = endSpan;

    observeStore(selectCurrentLanguage, () => {
      const promoContent = PROMO_SLIDER_CONTENT[index][getCurrentLanguage()].date;
      if (currentUser) {
        start.innerHTML = getStore().getState().isUserLoggedIn
          ? `${calcUserBirthDayRange(currentUser.birthDate).start} —`
          : promoContent.start;
        end.textContent = getStore().getState().isUserLoggedIn ? calcUserBirthDayRange(currentUser.birthDate).end : '';
      } else {
        start.innerHTML = `${promoContent.start}`;
        end.textContent = promoContent.end ? ` — ${promoContent.end}` : '';
      }
    });
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
