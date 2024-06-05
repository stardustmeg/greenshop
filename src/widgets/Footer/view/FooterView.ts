import type { LanguageChoiceType } from '@/shared/constants/common';
import type { languageVariants } from '@/shared/types/common';

import RouterModel from '@/app/Router/model/RouterModel.ts';
import InputFieldModel from '@/entities/InputField/model/InputFieldModel.ts';
import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import EventMediatorModel from '@/shared/EventMediator/model/EventMediatorModel.ts';
import InputModel from '@/shared/Input/model/InputModel.ts';
import LinkModel from '@/shared/Link/model/LinkModel.ts';
import getStore from '@/shared/Store/Store.ts';
import MEDIATOR_EVENT from '@/shared/constants/events.ts';
import * as FORM_FIELDS from '@/shared/constants/forms/fieldParams.ts';
import * as FORM_VALIDATION from '@/shared/constants/forms/validationParams.ts';
import { SERVER_MESSAGE_KEYS } from '@/shared/constants/messages.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import { showSuccessMessage } from '@/shared/utils/userMessage.ts';

import type { Link } from '../model/FooterModel';

import styles from './footerView.module.scss';

type Goal = {
  alt: string;
  description: languageVariants;
  id: string;
  imgH: number;
  imgW: number;
  src: string;
  title: languageVariants;
};

type Contact = {
  alt: string;
  description: string;
  href?: string;
  src: string;
  tag: keyof HTMLElementTagNameMap;
  target?: string;
};

type Img = {
  alt: string;
  src: string;
};

type GoalElement = {
  goalDescription: HTMLParagraphElement;
  goalItem: Goal;
  goalTitle: HTMLParagraphElement;
};

const GOALS: Goal[] = [
  {
    alt: 'Garden Care',
    description: {
      en: 'Provide expert tips and tools for maintaining a healthy and beautiful garden',
      ru: 'Для вас советы экспертов и инструменты для поддержания здорового и красивого сада',
    },
    id: 'goal_1',
    imgH: 93,
    imgW: 61,
    src: '/img/png/plant-01.png',
    title: {
      en: 'Garden Care',
      ru: 'Уход за садом',
    },
  },
  {
    alt: 'Plant Renovation',
    description: {
      en: 'Offer solutions and products to revive and rejuvenate struggling plants',
      ru: 'Предлагаем решения и продукты для восстановления и омоложения растений, переживающих трудности',
    },
    id: 'goal_2',
    imgH: 87,
    imgW: 68,
    src: '/img/png/plant-02.png',
    title: {
      en: 'Plant Renovation',
      ru: 'Обновление растений',
    },
  },
  {
    alt: 'Watering Garden',
    description: {
      en: 'Ensure optimal hydration with efficient and innovative watering systems and advice',
      ru: 'Помогаем обеспечить оптимальный уход с помощью эффективных и инновационных систем полива и наших рекомендаций',
    },
    id: 'goal_3',
    imgH: 85,
    imgW: 83,
    src: '/img/png/plant-03.png',
    title: {
      en: 'Watering Garden',
      ru: 'Полив сада',
    },
  },
];

const CONTACTS: Contact[] = [
  {
    alt: 'location greenshop',
    description: '70 West Buckingham Ave. Farmingdale, NY 11735',
    href: 'https://www.google.com/maps/place/70+West+Dr,+Massapequa,+NY+11758,+%D0%A1%D0%A8%D0%90/@40.7095332,-73.4562642,17z/data=!3m1!4b1!4m6!3m5!1s0x89e9d5501f64213b:0xb7d1b7ebb0725ac6!8m2!3d40.7095332!4d-73.4536893!16s%2Fg%2F11c5fp8grj?entry=ttu',
    src: '/img/png/location.png',
    tag: 'a',
    target: '_blank',
  },
  {
    alt: 'email greenshop',
    description: 'contact@greenshop.com',
    href: 'mailto:contact@greenshop.com',
    src: '/img/png/message.png',
    tag: 'a',
  },
  {
    alt: 'phone greenshop',
    description: '+88 01911 717 490',
    href: 'tel:+8801911717490',
    src: '/img/png/calling.png',
    tag: 'a',
  },
];

const SOCIAL: Img[] = [
  {
    alt: 'link meta',
    src: '/img/png/meta.png',
  },
  {
    alt: 'link instagram',
    src: '/img/png/instagram.png',
  },
  {
    alt: 'link twitterx',
    src: '/img/png/twitterx.png',
  },
  {
    alt: 'link linkedin',
    src: '/img/png/linkedin.png',
  },
  {
    alt: 'link union',
    src: '/img/png/union.png',
  },
];

const PAY: Img[] = [
  {
    alt: 'pay PayPal',
    src: '/img/png/pay-pp.png',
  },
  {
    alt: 'pay MasterCard',
    src: '/img/png/pay-mc.png',
  },
  {
    alt: 'pay Visa',
    src: '/img/png/pay-visa.png',
  },
  {
    alt: 'pay American Express',
    src: '/img/png/pay-ae.png',
  },
];

type textElementsType = {
  element: HTMLAnchorElement | HTMLButtonElement | HTMLInputElement | HTMLParagraphElement | HTMLUListElement;
  textItem: languageVariants;
};

const FOOTER_PAGE = {
  NAV_CATEGORY: {
    en: 'Categories',
    ru: 'Категории',
  },
  NAV_GENERAL: {
    en: 'General',
    ru: 'Главная',
  },
  NAV_HELP: {
    en: 'Help & Guide',
    ru: 'FAQ',
  },
  PAY: {
    en: 'We accept',
    ru: 'Мы принимаем',
  },
  SOCIAL: {
    en: 'Social Media',
    ru: 'Соцсети',
  },
  SUB_BTN: {
    en: 'Yes',
    ru: 'Да',
  },
  SUB_DESCRIPTION: {
    en: 'Subscribe to our newsletter for updates on new arrivals, exclusive discounts, and notifications about our latest blog articles. Stay informed and enhance your gardening experience with our expert tips and offers!',
    ru: 'Подпишитесь на нашу рассылку, чтобы получать обновления о новых поступлениях, эксклюзивные скидки и уведомления о наших последних статьях в блоге. Будьте в курсе и улучшайте свой опыт садоводства с нашими экспертными советами и предложениями!',
  },
  SUB_PLACEHOLDER: {
    en: 'enter your email address...',
    ru: 'введите ваш email...',
  },
  SUB_TITLE: {
    en: 'Want to subscribe to our newsletters?',
    ru: 'Хотите подписаться на нашу рассылку?',
  },
};

class FooterView {
  private footer: HTMLElement;

  private goals: GoalElement[] = [];

  private language: LanguageChoiceType;

  private navList: HTMLUListElement[] = [];

  private navListWrap: HTMLDivElement;

  private textElements: textElementsType[] = [];

  private wrapper: HTMLDivElement;

  constructor() {
    this.language = getStore().getState().currentLanguage;
    this.wrapper = this.createWrapper();
    this.footer = this.createHTML();
    const blockGoals = this.createGoalsHTML();
    const blockSubscribe = this.createSubscribeHTML();
    const goalsSubWrap = this.createWrapHTML();
    goalsSubWrap.append(blockGoals, blockSubscribe);
    const contactWrap = this.createContactHTML();
    const navigateWrap = this.createNavigateHTML();
    const socialWrap = this.createSocialHTML();
    this.navListWrap = this.createNavListWrapHTML();
    navigateWrap.append(this.navListWrap, socialWrap);
    this.wrapper.append(goalsSubWrap, contactWrap, navigateWrap);
  }

  private createContactHTML(): HTMLDivElement {
    const wrap = createBaseElement({
      cssClasses: [styles.contactWrap],
      tag: 'div',
    });
    const logoImg = createBaseElement({
      attributes: {
        alt: 'logo greenshop',
        src: '/img/png/logo.png',
      },
      cssClasses: [styles.logoImage],
      tag: 'img',
    });

    const wrapContactItems = createBaseElement({
      cssClasses: [styles.contactItemsWrap],
      tag: 'address',
    });
    CONTACTS.forEach((contact) => wrapContactItems.append(this.createContactItemHTML(contact)));
    wrap.append(logoImg, wrapContactItems);
    return wrap;
  }

  private createContactItemHTML(contact: Contact): HTMLElement {
    const attributes: { [key: string]: string } = {};

    if (contact.href) {
      attributes.href = contact.href;
    }

    if (contact.target) {
      attributes.target = contact.target;
    }

    const wrap = createBaseElement({
      attributes,
      cssClasses: [styles.contactItem],
      tag: contact.tag,
    });

    const icon = createBaseElement({
      attributes: {
        alt: contact.alt,
        src: contact.src,
      },
      cssClasses: [styles.contactIcon],
      tag: 'img',
    });

    const title = createBaseElement({
      cssClasses: [styles.contactText],
      innerContent: contact.description,
      tag: 'span',
    });

    wrap.append(icon, title);
    return wrap;
  }

  private createGoalHTML(goalItem: Goal): HTMLDivElement {
    const goalImg = createBaseElement({
      attributes: {
        alt: goalItem.alt,
        src: goalItem.src,
      },
      cssClasses: [styles.goalImage],
      tag: 'img',
    });
    const goalImgWrap = createBaseElement({ cssClasses: [styles.goalImgWrap], tag: 'div' });
    goalImgWrap.append(goalImg);
    const goalTextWrap = createBaseElement({ cssClasses: [styles.goalTextWrap], tag: 'div' });
    const title = createBaseElement({
      cssClasses: [styles.goalTitle],
      innerContent: goalItem.title[this.language],
      tag: 'p',
    });
    const description = createBaseElement({
      cssClasses: [styles.goalsDescription],
      innerContent: goalItem.description[this.language],
      tag: 'p',
    });
    goalTextWrap.append(title, description);
    const goal = createBaseElement({ cssClasses: [styles.goal], tag: 'div' });
    goal.append(goalImgWrap, goalTextWrap);
    this.goals.push({
      goalDescription: description,
      goalItem,
      goalTitle: title,
    });
    return goal;
  }

  private createGoalsHTML(): HTMLDivElement {
    const wrap = createBaseElement({
      cssClasses: [styles.goalsWrap],
      tag: 'div',
    });

    GOALS.forEach((goal) => {
      const goalHTML = this.createGoalHTML(goal);

      wrap.append(goalHTML);
    });

    return wrap;
  }

  private createHTML(): HTMLElement {
    this.footer = createBaseElement({
      cssClasses: [styles.footer],
      tag: 'footer',
    });

    this.footer.append(this.wrapper);
    return this.footer;
  }

  private createLink(linkParams: Link): LinkModel {
    const link = new LinkModel({
      attrs: {
        ...(linkParams.href && { href: linkParams.href }),
      },
      classes: [styles.link],
      text: linkParams.name[this.language],
    });

    if (linkParams.href) {
      link.getHTML().addEventListener('click', (event) => {
        event.preventDefault();
        if (linkParams.href) {
          RouterModel.getInstance().navigateTo(linkParams.href);
          EventMediatorModel.getInstance().notify(MEDIATOR_EVENT.REDRAW_PRODUCTS, '');
          window.scrollTo(0, 0);
        }
      });
    } else {
      link.getHTML().classList.add(styles.inactive);
    }

    return link;
  }

  private createLinkHTML(): HTMLDivElement {
    const wrap = createBaseElement({
      cssClasses: [styles.socialWrap],
      tag: 'div',
    });
    const title = createBaseElement({
      cssClasses: [styles.subTitle],
      innerContent: FOOTER_PAGE.SOCIAL[this.language],
      tag: 'p',
    });
    const buttonWrap = createBaseElement({
      cssClasses: [styles.linkWrap],
      tag: 'div',
    });
    SOCIAL.forEach((social) => {
      const link = createBaseElement({
        cssClasses: [styles.linkButton],
        tag: 'a',
      });
      const icon = createBaseElement({
        attributes: {
          alt: social.alt,
          src: social.src,
        },
        cssClasses: [styles.linkIcon],
        tag: 'img',
      });
      link.append(icon);
      buttonWrap.append(link);
    });
    wrap.append(title, buttonWrap);
    this.textElements.push({ element: title, textItem: FOOTER_PAGE.SOCIAL });
    return wrap;
  }

  private createNavListHTML(title: languageVariants, navItems: Link[]): HTMLUListElement {
    const navList = createBaseElement({
      cssClasses: [styles.navTitle],
      tag: 'ul',
    });

    const titleEl = createBaseElement({
      cssClasses: [styles.navTitle],
      innerContent: title[this.language],
      tag: 'p',
    });
    navList.append(titleEl);
    navItems.forEach((navItem) => {
      const navItemHTML = createBaseElement({
        cssClasses: [styles.navItem],
        tag: 'li',
      });
      const link = this.createLink(navItem);
      navItemHTML.append(link.getHTML());
      navList.append(navItemHTML);
      this.textElements.push({ element: link.getHTML(), textItem: navItem.name });
    });
    this.textElements.push({ element: titleEl, textItem: title });
    return navList;
  }

  private createNavListWrapHTML(): HTMLDivElement {
    return createBaseElement({
      cssClasses: [styles.navListWrap],
      tag: 'div',
    });
  }

  private createNavigateHTML(): HTMLDivElement {
    const wrap = createBaseElement({
      cssClasses: [styles.navigateWrap],
      tag: 'div',
    });
    return wrap;
  }

  private createPayHTML(): HTMLDivElement {
    const wrap = createBaseElement({
      cssClasses: [styles.payWrap],
      tag: 'div',
    });
    const title = createBaseElement({
      cssClasses: [styles.payTitle],
      innerContent: FOOTER_PAGE.PAY[this.language],
      tag: 'p',
    });
    const buttonWrap = createBaseElement({
      cssClasses: [styles.payImgWrap],
      tag: 'div',
    });
    PAY.forEach((pay) =>
      buttonWrap.append(
        createBaseElement({
          attributes: {
            alt: pay.alt,
            src: pay.src,
          },
          cssClasses: [styles.payImg],
          tag: 'img',
        }),
      ),
    );
    wrap.append(title, buttonWrap);
    this.textElements.push({ element: title, textItem: FOOTER_PAGE.PAY });
    return wrap;
  }

  private createSocialHTML(): HTMLDivElement {
    const wrap = createBaseElement({
      cssClasses: [styles.socialPayWrap],
      tag: 'div',
    });

    const blockSocial = this.createLinkHTML();
    const blockPay = this.createPayHTML();
    wrap.append(blockSocial, blockPay);
    return wrap;
  }

  private createSubFormHtml(): HTMLFormElement {
    const form = createBaseElement({
      cssClasses: [styles.subForm],
      tag: 'form',
    });
    const email = new InputFieldModel(FORM_FIELDS.EMAIL_NOT_LABEL_TEXT, FORM_VALIDATION.EMAIL_VALIDATE);
    const inputFieldElement = email.getView().getHTML();
    const inputHTML = email.getView().getInput().getHTML();
    if (inputFieldElement instanceof HTMLLabelElement) {
      inputFieldElement.classList.add(styles.label);
      inputHTML.classList.add(styles.input);
      form.append(inputFieldElement);
    } else if (inputFieldElement instanceof InputModel) {
      form.append(inputFieldElement.getHTML());
    }
    inputHTML.placeholder = FOOTER_PAGE.SUB_PLACEHOLDER[this.language];
    inputHTML.classList.add(styles.subInput);
    const submit = new ButtonModel({
      classes: [styles.subButton],
      text: FOOTER_PAGE.SUB_BTN[this.language],
    });

    submit.setDisabled();

    form.addEventListener('submit', (event) => {
      event.preventDefault();
    });

    submit.getHTML().addEventListener('click', () => {
      email.getView().getInput().clear();
      showSuccessMessage(SERVER_MESSAGE_KEYS.SUCCESSFUL_SUBSCRIBE);
      submit.setDisabled();
    });

    inputHTML.addEventListener('input', () => {
      this.switchSubmitFormButtonAccess(email, submit);
    });

    form.append(submit.getHTML());
    this.textElements.push({ element: submit.getHTML(), textItem: FOOTER_PAGE.SUB_BTN });
    this.textElements.push({ element: inputHTML, textItem: FOOTER_PAGE.SUB_PLACEHOLDER });
    return form;
  }

  private createSubscribeHTML(): HTMLDivElement {
    const wrap = createBaseElement({
      cssClasses: [styles.subWrap],
      tag: 'div',
    });
    const title = createBaseElement({
      cssClasses: [styles.subTitle],
      innerContent: FOOTER_PAGE.SUB_TITLE[this.language],
      tag: 'p',
    });

    const description = createBaseElement({
      cssClasses: [styles.subDescription],
      innerContent: FOOTER_PAGE.SUB_DESCRIPTION[this.language],
      tag: 'p',
    });
    this.textElements.push({ element: title, textItem: FOOTER_PAGE.SUB_TITLE });
    this.textElements.push({ element: description, textItem: FOOTER_PAGE.SUB_DESCRIPTION });
    const form = this.createSubFormHtml();
    wrap.append(title, form, description);
    return wrap;
  }

  private createWrapHTML(): HTMLDivElement {
    const wrap = createBaseElement({
      cssClasses: [styles.goalsSubWrap],
      tag: 'div',
    });

    return wrap;
  }

  private createWrapper(): HTMLDivElement {
    this.wrapper = createBaseElement({
      cssClasses: [styles.wrapper],
      tag: 'div',
    });

    return this.wrapper;
  }

  private switchSubmitFormButtonAccess(email: InputFieldModel, submitButton: ButtonModel): boolean {
    if (email.getIsValid()) {
      submitButton.setEnabled();
    } else {
      submitButton.setDisabled();
    }

    return true;
  }

  public addNavLists(generalLinks: Link[], helpLinks: Link[], categoryLinks: Link[]): void {
    const generalNav = this.createNavListHTML(FOOTER_PAGE.NAV_GENERAL, generalLinks);
    const helpNav = this.createNavListHTML(FOOTER_PAGE.NAV_HELP, helpLinks);
    const categoryNav = this.createNavListHTML(FOOTER_PAGE.NAV_CATEGORY, categoryLinks);
    this.navList.push(generalNav, helpNav, categoryNav);
    this.navListWrap.append(generalNav, helpNav, categoryNav);
  }

  public getHTML(): HTMLElement {
    return this.footer;
  }

  public updateLanguage(): void {
    this.language = getStore().getState().currentLanguage;
    this.goals.forEach((goalEl) => {
      const title = goalEl.goalTitle;
      const description = goalEl.goalDescription;
      title.textContent = goalEl.goalItem.title[this.language];
      description.textContent = goalEl.goalItem.description[this.language];
    });
    this.textElements.forEach((el) => {
      const elHTML = el.element;
      if (elHTML instanceof HTMLInputElement) {
        elHTML.placeholder = el.textItem[this.language];
      } else {
        elHTML.textContent = el.textItem[this.language];
      }
    });
  }
}

export default FooterView;
