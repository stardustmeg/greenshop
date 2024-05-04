import LinkModel from '@/shared/Link/model/LinkModel.ts';
import { PAGE_ANSWER, PAGE_DESCRIPTION, PAGE_ID, PAGE_LINK_TEXT } from '@/shared/constants/pages.ts';
import TAG_NAME from '@/shared/constants/tags.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

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
    this.authDescription = createBaseElement({
      cssClasses: [styles.authDescription],
      innerContent: PAGE_DESCRIPTION.REGISTRATION,
      tag: TAG_NAME.H3,
    });

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
    this.loginLink = new LinkModel({
      attrs: {
        href: PAGE_ID.LOGIN_PAGE,
      },
      classes: [styles.loginLink],
      text: PAGE_LINK_TEXT.LOGIN,
    });

    return this.loginLink;
  }

  private createRegisterSpan(): HTMLSpanElement {
    this.registerSpan = createBaseElement({
      cssClasses: [styles.registerSpan],
      innerContent: PAGE_LINK_TEXT.REGISTRATION,
      tag: TAG_NAME.SPAN,
    });

    return this.registerSpan;
  }

  private createToLoginPageWrapper(): HTMLSpanElement {
    this.toLoginPageWrapper = createBaseElement({
      cssClasses: [styles.toLoginPageWrapper],
      innerContent: PAGE_ANSWER.REGISTRATION,
      tag: TAG_NAME.SPAN,
    });

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
    }, 200);
    return true;
  }
}
export default RegistrationPageView;
