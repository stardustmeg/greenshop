import type { User } from '@/shared/types/user';

import getCustomerModel from '@/shared/API/customer/model/CustomerModel.ts';
import InputModel from '@/shared/Input/model/InputModel.ts';
import serverMessageModel from '@/shared/ServerMessage/model/ServerMessageModel.ts';
import getStore from '@/shared/Store/Store.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import { AUTOCOMPLETE_OPTION } from '@/shared/constants/common.ts';
import { INPUT_TYPE } from '@/shared/constants/forms.ts';
import { MESSAGE_STATUS, SERVER_MESSAGE_KEYS } from '@/shared/constants/messages.ts';
import PROMO_SLIDER_CONTENT from '@/shared/constants/promo.ts';
import SVG_DETAILS from '@/shared/constants/svg.ts';
import calcUserBirthDayRange from '@/shared/utils/calcUserBirthDayRange.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import createSVGUse from '@/shared/utils/createSVGUse.ts';
import showErrorMessage from '@/shared/utils/userMessage.ts';

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
      innerContent: currentUser
        ? calcUserBirthDayRange(currentUser.birthDate).start
        : PROMO_SLIDER_CONTENT[index].en.date.start ?? '',
      tag: 'span',
    });

    const end = createBaseElement({
      cssClasses: [styles.sliderDateEnd],
      innerContent: currentUser
        ? calcUserBirthDayRange(currentUser.birthDate).end
        : PROMO_SLIDER_CONTENT[index].en.date.end ?? '',
      tag: 'span',
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

    const currentPromoCode = new InputModel({
      autocomplete: AUTOCOMPLETE_OPTION.ON,
      id: '',
      placeholder: '',
      type: INPUT_TYPE.TEXT,
      value: code,
    });

    currentPromoCode.getHTML().classList.add(styles.currentPromoCode);

    const svg = document.createElementNS(SVG_DETAILS.SVG_URL, 'svg');
    svg.append(createSVGUse(SVG_DETAILS.COPY));

    svg.addEventListener('click', () => {
      window.navigator.clipboard
        .writeText(currentPromoCode.getValue())
        .then(() =>
          serverMessageModel.showServerMessage(
            SERVER_MESSAGE_KEYS.SUCCESSFUL_COPY_PROMO_CODE_TO_CLIPBOARD,
            MESSAGE_STATUS.SUCCESS,
          ),
        )
        .catch(() => serverMessageModel.showServerMessage(SERVER_MESSAGE_KEYS.BAD_REQUEST, MESSAGE_STATUS.ERROR));
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

    const { description, img, title } = this.createSliderSlideInfo(index);

    slide.append(
      title,
      description,
      this.createPromoCodeSpan(PROMO_SLIDER_CONTENT[index][getStore().getState().currentLanguage].promoCode),
      img,
    );

    observeStore(selectCurrentLanguage, () => {
      title.textContent = PROMO_SLIDER_CONTENT[index][getStore().getState().currentLanguage].title;
      description.textContent = PROMO_SLIDER_CONTENT[index][getStore().getState().currentLanguage].description;
    });

    if (PROMO_SLIDER_CONTENT[index].en.date.start === null) {
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
    img: HTMLImageElement;
    title: HTMLHeadingElement;
  } {
    const img = createBaseElement({
      attributes: {
        src: PROMO_SLIDER_CONTENT[index][getStore().getState().currentLanguage].img,
      },
      cssClasses: [styles.sliderImage],
      tag: 'img',
    });

    const title = createBaseElement({
      cssClasses: [styles.sliderTitle],
      innerContent: PROMO_SLIDER_CONTENT[index][getStore().getState().currentLanguage].title,
      tag: 'h3',
    });

    const description = createBaseElement({
      cssClasses: [styles.sliderDescription],
      innerContent: PROMO_SLIDER_CONTENT[index][getStore().getState().currentLanguage].description,
      tag: 'p',
    });

    return { description, img, title };
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
}

export default PromoCodeSliderView;
