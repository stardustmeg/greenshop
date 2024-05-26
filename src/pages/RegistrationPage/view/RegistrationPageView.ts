import LinkModel from '@/shared/Link/model/LinkModel.ts';
import getStore from '@/shared/Store/Store.ts';
import {
  PAGE_ANSWER,
  PAGE_ANSWER_KEYS,
  PAGE_DESCRIPTION,
  PAGE_DESCRIPTION_KEYS,
  PAGE_ID,
  PAGE_LINK_TEXT,
  PAGE_LINK_TEXT_KEYS,
} from '@/shared/constants/pages.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import observeCurrentLanguage from '@/shared/utils/observeCurrentLanguage.ts';

import styles from './registrationPageView.module.scss';

class RegistrationPageView {
  private authDescription: HTMLHeadingElement;

  private authWrapper: HTMLDivElement;

  private designElement: HTMLDivElement;

  private linksWrapper: HTMLDivElement;

  private loginLink: LinkModel;

  private page: HTMLDivElement;

  private parent: HTMLDivElement;

  private registerSpan: HTMLSpanElement;

  private toLoginPageWrapper: HTMLSpanElement;

  constructor(parent: HTMLDivElement) {
    this.parent = parent;
    this.parent.innerHTML = '';
    this.toLoginPageWrapper = this.createToLoginPageWrapper();
    this.registerSpan = this.createRegisterSpan();
    this.designElement = this.createDesignElement();
    this.loginLink = this.createLoginLink();
    this.authDescription = this.createAuthDescription();
    this.linksWrapper = this.createLinksWrapper();
    this.authWrapper = this.createAuthWrapper();
    this.page = this.createHTML();
    window.scrollTo(0, 0);
  }

  private createAuthDescription(): HTMLHeadingElement {
    this.authDescription = createBaseElement({
      cssClasses: [styles.authDescription],
      innerContent: PAGE_DESCRIPTION[getStore().getState().currentLanguage].REGISTRATION,
      tag: 'h3',
    });

    observeCurrentLanguage(this.authDescription, PAGE_DESCRIPTION, PAGE_DESCRIPTION_KEYS.REGISTRATION);

    return this.authDescription;
  }

  private createAuthWrapper(): HTMLDivElement {
    this.authWrapper = createBaseElement({
      cssClasses: [styles.authWrapper],
      tag: 'div',
    });

    this.authWrapper.append(this.linksWrapper, this.authDescription, this.toLoginPageWrapper);
    return this.authWrapper;
  }

  private createDesignElement(): HTMLDivElement {
    this.designElement = createBaseElement({
      cssClasses: [styles.designElement],
      tag: 'div',
    });
    return this.designElement;
  }

  private createHTML(): HTMLDivElement {
    this.page = createBaseElement({
      cssClasses: [styles.registrationPage],
      tag: 'div',
    });

    this.page.append(this.authWrapper);
    this.parent.append(this.page);

    return this.page;
  }

  private createLinksWrapper(): HTMLDivElement {
    this.linksWrapper = createBaseElement({
      cssClasses: [styles.linksWrapper],
      tag: 'div',
    });

    this.linksWrapper.append(this.loginLink.getHTML(), this.designElement, this.registerSpan);
    return this.linksWrapper;
  }

  private createLoginLink(): LinkModel {
    this.loginLink = new LinkModel({
      attrs: {
        href: PAGE_ID.LOGIN_PAGE,
      },
      classes: [styles.loginLink],
      text: PAGE_LINK_TEXT[getStore().getState().currentLanguage].LOGIN,
    });

    observeCurrentLanguage(this.loginLink.getHTML(), PAGE_LINK_TEXT, PAGE_LINK_TEXT_KEYS.LOGIN);

    return this.loginLink;
  }

  private createRegisterSpan(): HTMLSpanElement {
    this.registerSpan = createBaseElement({
      cssClasses: [styles.registerSpan],
      innerContent: PAGE_LINK_TEXT[getStore().getState().currentLanguage].REGISTRATION,
      tag: 'span',
    });

    observeCurrentLanguage(this.registerSpan, PAGE_LINK_TEXT, PAGE_LINK_TEXT_KEYS.REGISTRATION);

    return this.registerSpan;
  }

  private createToLoginPageWrapper(): HTMLSpanElement {
    this.toLoginPageWrapper = createBaseElement({
      cssClasses: [styles.toLoginPageWrapper],
      innerContent: PAGE_ANSWER[getStore().getState().currentLanguage].REGISTRATION,
      tag: 'span',
    });

    observeCurrentLanguage(this.toLoginPageWrapper, PAGE_ANSWER, PAGE_ANSWER_KEYS.REGISTRATION);

    return this.toLoginPageWrapper;
  }

  public getAuthWrapper(): HTMLDivElement {
    return this.authWrapper;
  }

  public getHTML(): HTMLDivElement {
    return this.page;
  }

  public getLoginLink(): LinkModel {
    return this.loginLink;
  }

  public getToLoginPageWrapper(): HTMLSpanElement {
    return this.toLoginPageWrapper;
  }
}
export default RegistrationPageView;
