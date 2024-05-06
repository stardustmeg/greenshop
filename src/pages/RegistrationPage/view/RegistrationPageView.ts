import LinkModel from '@/shared/Link/model/LinkModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { PAGE_TIMEOUT_DURATION } from '@/shared/constants/animations.ts';
import {
  PAGE_ANSWER,
  PAGE_ANSWER_KEYS,
  PAGE_DESCRIPTION,
  PAGE_DESCRIPTION_KEYS,
  PAGE_ID,
  PAGE_LINK_TEXT,
  PAGE_LINK_TEXT_KEYS,
} from '@/shared/constants/pages.ts';
import TAG_NAME from '@/shared/constants/tags.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import observeCurrentLanguage from '@/shared/utils/observeCurrentLanguage.ts';

import styles from './registrationPageView.module.scss';

class RegistrationPageView {
  private authDescription: HTMLHeadingElement;

  private authWrapper: HTMLDivElement;

  private linksWrapper: HTMLDivElement;

  private loginLink: LinkModel;

  private page: HTMLDivElement;

  private parent: HTMLDivElement;

  private registerSpan: HTMLSpanElement;

  private toLoginPageWrapper: HTMLSpanElement;

  constructor(parent: HTMLDivElement) {
    this.parent = parent;
    this.toLoginPageWrapper = this.createToLoginPageWrapper();
    this.registerSpan = this.createRegisterSpan();
    this.loginLink = this.createLoginLink();
    this.authDescription = this.createAuthDescription();
    this.linksWrapper = this.createLinksWrapper();
    this.authWrapper = this.createAuthWrapper();
    this.page = this.createHTML();
  }

  private createAuthDescription(): HTMLHeadingElement {
    const { currentLanguage } = getStore().getState();
    this.authDescription = createBaseElement({
      cssClasses: [styles.authDescription],
      innerContent: PAGE_DESCRIPTION[currentLanguage].REGISTRATION,
      tag: TAG_NAME.H3,
    });

    observeCurrentLanguage(this.authDescription, PAGE_DESCRIPTION, PAGE_DESCRIPTION_KEYS.REGISTRATION);

    return this.authDescription;
  }

  private createAuthWrapper(): HTMLDivElement {
    this.authWrapper = createBaseElement({
      cssClasses: [styles.authWrapper],
      tag: TAG_NAME.DIV,
    });

    this.authWrapper.append(this.linksWrapper, this.authDescription, this.toLoginPageWrapper);
    return this.authWrapper;
  }

  private createHTML(): HTMLDivElement {
    this.page = createBaseElement({
      cssClasses: [styles.registrationPage],
      tag: TAG_NAME.DIV,
    });

    this.page.append(this.authWrapper);
    this.parent.append(this.page);

    return this.page;
  }

  private createLinksWrapper(): HTMLDivElement {
    this.linksWrapper = createBaseElement({
      cssClasses: [styles.linksWrapper],
      tag: TAG_NAME.DIV,
    });

    this.linksWrapper.append(this.loginLink.getHTML(), this.registerSpan);
    return this.linksWrapper;
  }

  private createLoginLink(): LinkModel {
    const { currentLanguage } = getStore().getState();
    this.loginLink = new LinkModel({
      attrs: {
        href: PAGE_ID.LOGIN_PAGE,
      },
      classes: [styles.loginLink],
      text: PAGE_LINK_TEXT[currentLanguage].LOGIN,
    });

    observeCurrentLanguage(this.loginLink.getHTML(), PAGE_LINK_TEXT, PAGE_LINK_TEXT_KEYS.LOGIN);

    return this.loginLink;
  }

  private createRegisterSpan(): HTMLSpanElement {
    const { currentLanguage } = getStore().getState();
    this.registerSpan = createBaseElement({
      cssClasses: [styles.registerSpan],
      innerContent: PAGE_LINK_TEXT[currentLanguage].REGISTRATION,
      tag: TAG_NAME.SPAN,
    });

    observeCurrentLanguage(this.registerSpan, PAGE_LINK_TEXT, PAGE_LINK_TEXT_KEYS.REGISTRATION);

    return this.registerSpan;
  }

  private createToLoginPageWrapper(): HTMLSpanElement {
    const { currentLanguage } = getStore().getState();
    this.toLoginPageWrapper = createBaseElement({
      cssClasses: [styles.toLoginPageWrapper],
      innerContent: PAGE_ANSWER[currentLanguage].REGISTRATION,
      tag: TAG_NAME.SPAN,
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

  public hide(): boolean {
    this.page.classList.add(styles.registrationPage_hidden);
    return true;
  }

  public show(): boolean {
    setTimeout(() => {
      this.page.classList.remove(styles.registrationPage_hidden);
    }, PAGE_TIMEOUT_DURATION);
    return true;
  }
}
export default RegistrationPageView;
