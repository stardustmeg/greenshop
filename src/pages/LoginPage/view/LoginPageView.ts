import { PAGE_ANSWER, PAGE_DESCRIPTION, PAGE_ID, PAGE_LINK_TEXT } from '@/shared/constants/pages.ts';
import TAG_NAME from '@/shared/constants/tags.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

import styles from './loginPageView.module.scss';

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
      cssClasses: [styles.authDescription],
      innerContent: PAGE_DESCRIPTION.LOGIN,
      tag: TAG_NAME.H3,
    });

    return this.authDescription;
  }

  private createAuthWrapper(): HTMLDivElement {
    this.authWrapper = createBaseElement({
      cssClasses: [styles.authWrapper],
      tag: TAG_NAME.DIV,
    });

    this.authWrapper.append(this.linksWrapper, this.authDescription, this.createToRegisterPageWrapper());
    return this.authWrapper;
  }

  private createHTML(): HTMLDivElement {
    this.page = createBaseElement({
      cssClasses: [styles.loginPage],
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

    this.linksWrapper.append(this.loginSpan, this.registerLink);
    return this.linksWrapper;
  }

  private createLoginSpan(): HTMLSpanElement {
    this.loginSpan = createBaseElement({
      cssClasses: [styles.loginSpan],
      innerContent: PAGE_LINK_TEXT.LOGIN,
      tag: TAG_NAME.SPAN,
    });

    return this.loginSpan;
  }

  private createRegisterLink(): HTMLAnchorElement {
    this.registerLink = createBaseElement({
      attributes: {
        href: PAGE_ID.REGISTRATION_PAGE,
      },
      cssClasses: [styles.registerLink],
      innerContent: PAGE_LINK_TEXT.REGISTRATION,
      tag: TAG_NAME.A,
    });

    return this.registerLink;
  }

  private createToRegisterPageWrapper(): HTMLSpanElement {
    const toRegisterPageWrapper = createBaseElement({
      cssClasses: [styles.toRegisterPageWrapper],
      innerContent: PAGE_ANSWER.LOGIN,
      tag: TAG_NAME.SPAN,
    });
    const copyRegisterLink = this.registerLink.cloneNode(true);
    toRegisterPageWrapper.append(copyRegisterLink);
    return toRegisterPageWrapper;
  }

  public getAuthWrapper(): HTMLDivElement {
    return this.authWrapper;
  }

  public getHTML(): HTMLDivElement {
    return this.page;
  }

  public getRegisterLink(): HTMLAnchorElement {
    return this.registerLink;
  }

  public hide(): boolean {
    this.page.classList.add(styles.loginPage_hidden);
    return true;
  }

  public show(): boolean {
    this.page.classList.remove(styles.loginPage_hidden);
    return true;
  }
}
export default LoginPageView;
