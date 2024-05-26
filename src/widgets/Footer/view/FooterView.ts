import type { LanguageChoiceType } from '@/shared/constants/common';
import type { languageVariants } from '@/shared/types/common';

import RouterModel from '@/app/Router/model/RouterModel.ts';
import InputFieldModel from '@/entities/InputField/model/InputFieldModel.ts';
import LinkModel from '@/shared/Link/model/LinkModel.ts';
import getStore from '@/shared/Store/Store.ts';
import * as FORM_FIELDS from '@/shared/constants/forms/fieldParams.ts';
import * as FORM_VALIDATION from '@/shared/constants/forms/validationParams.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

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
  src: string;
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
      ru: 'Для Вас советы экспертов и инструменты для поддержания здорового и красивого сада',
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
    src: '/img/png/location.png',
  },
  {
    alt: 'email greenshop',
    description: 'contact@greenshop.com',
    src: '/img/png/message.png',
  },
  {
    alt: 'phone greenshop',
    description: '+88 01911 717 490',
    src: '/img/png/calling.png',
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
  SUB_BTN: {
    en: 'Join',
    ru: 'С нами',
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
    en: 'Would you like to join newsletters?',
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
      tag: 'div',
    });
    CONTACTS.forEach((contact) => wrapContactItems.append(this.createContactItemHTML(contact)));
    wrap.append(logoImg, wrapContactItems);
    return wrap;
  }

  private createContactItemHTML(contact: Contact): HTMLDivElement {
    const wrap = createBaseElement({
      cssClasses: [styles.contactItem],
      tag: 'div',
    });
    const icon = createBaseElement({
      attributes: {
        alt: contact.alt,
        src: contact.src,
      },
      cssClasses: [styles.contactIcon],
      tag: 'img',
    });
    const tittle = createBaseElement({
      cssClasses: [styles.contactText],
      innerContent: contact.description,
      tag: 'p',
    });
    wrap.append(icon, tittle);
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
      innerContent: 'Social Media',
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
      innerContent: 'We accept',
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
    const email = new InputFieldModel(FORM_FIELDS.EMAIL, FORM_VALIDATION.EMAIL_VALIDATE);
    const inputHTML = email.getView().getInput().getHTML();
    inputHTML.placeholder = FOOTER_PAGE.SUB_PLACEHOLDER[this.language];
    inputHTML.classList.add(styles.subInput);
    const submit = createBaseElement({
      cssClasses: [styles.subButton],
      innerContent: FOOTER_PAGE.SUB_BTN[this.language],
      tag: 'button',
    });
    form.append(inputHTML, submit);
    this.textElements.push({ element: submit, textItem: FOOTER_PAGE.SUB_BTN });
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
