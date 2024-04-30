import { PAGE_DESCRIPTION, PAGE_LINK_TEXT, PAGES_IDS, TAG_NAMES } from '@/shared/constants/enums.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

import LOGIN_PAGE_STYLES from './loginPageView.module.scss';

class LoginPageView {
  private authDescription: HTMLHeadingElement;

  private authWrapper: HTMLDivElement;

  private linksWrapper: HTMLDivElement;

  private loginSpan: HTMLSpanElement;

  private page: HTMLDivElement;

  private parent: HTMLDivElement;

  private registerLink: HTMLAnchorElement;

  constructor(parent: HTMLDivElement) {
    this.parent = parent;
    this.loginSpan = this.createLoginSpan();
    this.registerLink = this.createRegisterLink();
    this.authDescription = this.createAuthDescription();
    this.linksWrapper = this.createLinksWrapper();
    this.authWrapper = this.createAuthWrapper();
    this.page = this.createHTML();
  }

  private createAuthDescription(): HTMLHeadingElement {
    this.authDescription = createBaseElement({
      cssClasses: [LOGIN_PAGE_STYLES.authDescription],
      innerContent: PAGE_DESCRIPTION.LOGIN,
      tag: TAG_NAMES.H3,
    });

    return this.authDescription;
  }

  private createAuthWrapper(): HTMLDivElement {
    this.authWrapper = createBaseElement({
      cssClasses: [LOGIN_PAGE_STYLES.authWrapper],
      tag: TAG_NAMES.DIV,
    });

    this.authWrapper.append(this.linksWrapper, this.authDescription);
    return this.authWrapper;
  }

  private createHTML(): HTMLDivElement {
    this.page = createBaseElement({
      cssClasses: [LOGIN_PAGE_STYLES.loginPage],
      tag: TAG_NAMES.DIV,
    });

    this.page.append(this.authWrapper);
    this.parent.append(this.page);

    return this.page;
  }

  private createLinksWrapper(): HTMLDivElement {
    this.linksWrapper = createBaseElement({
      cssClasses: [LOGIN_PAGE_STYLES.linksWrapper],
      tag: TAG_NAMES.DIV,
    });

    this.linksWrapper.append(this.loginSpan, this.registerLink);
    return this.linksWrapper;
  }

  private createLoginSpan(): HTMLSpanElement {
    this.loginSpan = createBaseElement({
      cssClasses: [LOGIN_PAGE_STYLES.loginSpan],
      innerContent: PAGE_LINK_TEXT.LOGIN,
      tag: TAG_NAMES.SPAN,
    });

    return this.loginSpan;
  }

  private createRegisterLink(): HTMLAnchorElement {
    this.registerLink = createBaseElement({
      attributes: {
        href: PAGES_IDS.REGISTRATION_PAGE,
      },
      cssClasses: [LOGIN_PAGE_STYLES.registerLink],
      innerContent: PAGE_LINK_TEXT.REGISTRATION,
      tag: TAG_NAMES.A,
    });

    return this.registerLink;
  }

  public getAuthWrapper(): HTMLDivElement {
    return this.authWrapper;
  }

  public getHTML(): HTMLDivElement {
    return this.page;
  }

  public hide(): boolean {
    this.page.classList.add(LOGIN_PAGE_STYLES.loginPage_hidden);
    return true;
  }

  public show(): boolean {
    this.page.classList.remove(LOGIN_PAGE_STYLES.loginPage_hidden);
    return true;
  }
}
export default LoginPageView;
