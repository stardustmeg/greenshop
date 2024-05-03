import { PAGE_DESCRIPTION, PAGE_LINK_TEXT, PAGES_IDS, TAG_NAMES } from '@/shared/constants/enums.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

import styles from './registrationPageView.module.scss';

class RegistrationPageView {
  private authDescription: HTMLHeadingElement;

  private authWrapper: HTMLDivElement;

  private linksWrapper: HTMLDivElement;

  private loginLink: HTMLAnchorElement;

  private page: HTMLDivElement;

  private parent: HTMLDivElement;

  private registerSpan: HTMLSpanElement;

  constructor(parent: HTMLDivElement) {
    this.parent = parent;
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
      tag: TAG_NAMES.H3,
    });

    return this.authDescription;
  }

  private createAuthWrapper(): HTMLDivElement {
    this.authWrapper = createBaseElement({
      cssClasses: [styles.authWrapper],
      tag: TAG_NAMES.DIV,
    });

    this.authWrapper.append(this.linksWrapper, this.authDescription);
    return this.authWrapper;
  }

  private createHTML(): HTMLDivElement {
    this.page = createBaseElement({
      cssClasses: [styles.registrationPage],
      tag: TAG_NAMES.DIV,
    });

    this.page.append(this.authWrapper);
    this.parent.append(this.page);

    return this.page;
  }

  private createLinksWrapper(): HTMLDivElement {
    this.linksWrapper = createBaseElement({
      cssClasses: [styles.linksWrapper],
      tag: TAG_NAMES.DIV,
    });

    this.linksWrapper.append(this.loginLink, this.registerSpan);
    return this.linksWrapper;
  }

  private createLoginLink(): HTMLAnchorElement {
    this.loginLink = createBaseElement({
      attributes: {
        href: PAGES_IDS.LOGIN_PAGE,
      },
      cssClasses: [styles.loginLink],
      innerContent: PAGE_LINK_TEXT.LOGIN,
      tag: TAG_NAMES.A,
    });

    return this.loginLink;
  }

  private createRegisterSpan(): HTMLSpanElement {
    this.registerSpan = createBaseElement({
      cssClasses: [styles.registerSpan],
      innerContent: PAGE_LINK_TEXT.REGISTRATION,
      tag: TAG_NAMES.SPAN,
    });

    return this.registerSpan;
  }

  public getAuthWrapper(): HTMLDivElement {
    return this.authWrapper;
  }

  public getHTML(): HTMLDivElement {
    return this.page;
  }

  public getLoginLink(): HTMLAnchorElement {
    return this.loginLink;
  }

  public hide(): boolean {
    this.page.classList.add(styles.registrationPage_hidden);
    return true;
  }

  public show(): boolean {
    this.page.classList.remove(styles.registrationPage_hidden);
    return true;
  }
}
export default RegistrationPageView;
