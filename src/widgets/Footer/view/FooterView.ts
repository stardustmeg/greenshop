import InputFieldModel from '@/entities/InputField/model/InputFieldModel.ts';
import * as FORM_FIELDS from '@/shared/constants/forms/fieldParams.ts';
import * as FORM_VALIDATION from '@/shared/constants/forms/validationParams.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

import styles from './footerView.module.scss';

type Goal = {
  alt: string;
  description: string;
  imgH: number;
  imgW: number;
  src: string;
  title: string;
};

type Contact = {
  alt: string;
  description: string;
  src: string;
};

type Social = {
  alt: string;
  src: string;
};

const GOALS: Goal[] = [
  {
    alt: 'Garden Care',
    description: 'Provide expert tips and tools for maintaining a healthy and beautiful garden',
    imgH: 93,
    imgW: 61,
    src: '/img/png/plant-01.png',
    title: 'Garden Care',
  },
  {
    alt: 'Plant Renovation',
    description: 'Offer solutions and products to revive and rejuvenate struggling plants',
    imgH: 87,
    imgW: 68,
    src: '/img/png/plant-02.png',
    title: 'Plant Renovation',
  },
  {
    alt: 'Watering Garden',
    description: 'Ensure optimal hydration with efficient and innovative watering systems and advice',
    imgH: 85,
    imgW: 83,
    src: '/img/png/plant-03.png',
    title: 'Watering Garden',
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

const SOCIAL: Social[] = [
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

class FooterView {
  private footer: HTMLElement;

  private wrapper: HTMLDivElement;

  constructor() {
    this.wrapper = this.createWrapper();
    this.footer = this.createHTML();
    const blockGoals = this.createGoalsHTML();
    const blockSubscribe = this.createSubscribeHTML();
    const goalsSubWrap = this.createWrapHTML();
    goalsSubWrap.append(blockGoals, blockSubscribe);
    const contactWrap = this.createContactHTML();
    const socialWrap = this.createSocialHTML();
    this.wrapper.append(goalsSubWrap, contactWrap, socialWrap);
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
    logoImg.style.width = `150px`;
    logoImg.style.height = `34px`;

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
    icon.style.width = `20px`;
    icon.style.height = `20px`;
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
    goalImg.style.width = `${goalItem.imgW}px`;
    goalImg.style.height = `${goalItem.imgH}px`;
    const goalImgWrap = createBaseElement({
      cssClasses: [styles.goalImgWrap],
      tag: 'div',
    });
    goalImgWrap.append(goalImg);
    const goalTextWrap = createBaseElement({
      cssClasses: [styles.goalTextWrap],
      tag: 'div',
    });
    const title = createBaseElement({
      cssClasses: [styles.goalTitle],
      innerContent: goalItem.title,
      tag: 'p',
    });
    const description = createBaseElement({
      cssClasses: [styles.goalsDescription],
      innerContent: goalItem.description,
      tag: 'p',
    });
    goalTextWrap.append(title, description);
    const goal = createBaseElement({
      cssClasses: [styles.goal],
      tag: 'div',
    });
    goal.append(goalImgWrap, goalTextWrap);
    return goal;
  }

  private createGoalsHTML(): HTMLDivElement {
    const wrap = createBaseElement({
      cssClasses: [styles.goalsWrap],
      tag: 'div',
    });

    GOALS.forEach((goal) => {
      wrap.append(this.createGoalHTML(goal));
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

  private createSocialHTML(): HTMLDivElement {
    const wrap = createBaseElement({
      cssClasses: [styles.socialSubWrap],
      tag: 'div',
    });

    const blockSocial = this.createLinkHTML();
    wrap.append(blockSocial);
    return wrap;
  }

  private createSubFormHtml(): HTMLFormElement {
    const form = createBaseElement({
      cssClasses: [styles.subForm],
      tag: 'form',
    });
    const email = new InputFieldModel(FORM_FIELDS.EMAIL, FORM_VALIDATION.EMAIL_VALIDATE);
    const inputHTML = email.getView().getInput().getHTML();
    inputHTML.placeholder = 'enter your email address...';
    inputHTML.classList.add(styles.subInput);
    const submit = createBaseElement({ cssClasses: [styles.subButton], innerContent: 'Join', tag: 'button' });
    form.append(inputHTML, submit);
    return form;
  }

  private createSubscribeHTML(): HTMLDivElement {
    const wrap = createBaseElement({
      cssClasses: [styles.subWrap],
      tag: 'div',
    });
    const title = createBaseElement({
      cssClasses: [styles.subTitle],
      innerContent: 'Would you like to join newsletters?',
      tag: 'p',
    });

    const description = createBaseElement({
      cssClasses: [styles.subDescription],
      innerContent:
        'Subscribe to our newsletter for updates on new arrivals, exclusive discounts, and notifications about our latest blog articles. Stay informed and enhance your gardening experience with our expert tips and offers!',
      tag: 'p',
    });

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

  public getHTML(): HTMLElement {
    return this.footer;
  }

  public getWrapper(): HTMLDivElement {
    return this.wrapper;
  }
}

export default FooterView;
