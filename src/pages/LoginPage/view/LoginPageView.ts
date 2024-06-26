import LinkModel from '@/shared/Link/model/LinkModel.ts';
import { PAGE_LINK_TEXT, PAGE_LINK_TEXT_KEY } from '@/shared/constants/links.ts';
import {
  PAGE_ANSWER,
  PAGE_ANSWER_KEY,
  PAGE_DESCRIPTION,
  PAGE_DESCRIPTION_KEY,
  PAGE_ID,
} from '@/shared/constants/pages.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import getCurrentLanguage from '@/shared/utils/getCurrentLanguage.ts';
import observeCurrentLanguage from '@/shared/utils/observeCurrentLanguage.ts';

import styles from './loginPageView.module.scss';

class LoginPageView {
  private authDescription: HTMLHeadingElement;

  private authWrapper: HTMLDivElement;

  private designElement: HTMLDivElement;

  private linksWrapper: HTMLDivElement;

  private loginSpan: HTMLSpanElement;

  private page: HTMLDivElement;

  private parent: HTMLDivElement;

  private registerLink: LinkModel;

  private toRegisterPageWrapper: HTMLSpanElement;

  constructor(parent: HTMLDivElement) {
    this.parent = parent;
    this.parent.innerHTML = '';
    this.toRegisterPageWrapper = this.createToRegisterPageWrapper();
    this.loginSpan = this.createLoginSpan();
    this.designElement = this.createDesignElement();
    this.registerLink = this.createRegisterLink();
    this.authDescription = this.createAuthDescription();
    this.linksWrapper = this.createLinksWrapper();
    this.authWrapper = this.createAuthWrapper();
    this.page = this.createHTML();
    window.scrollTo(0, 0);
  }

  private createAuthDescription(): HTMLHeadingElement {
    this.authDescription = createBaseElement({
      cssClasses: [styles.authDescription],
      innerContent: PAGE_DESCRIPTION[getCurrentLanguage()].LOGIN,
      tag: 'h3',
    });
    observeCurrentLanguage(this.authDescription, PAGE_DESCRIPTION, PAGE_DESCRIPTION_KEY.LOGIN);
    return this.authDescription;
  }

  private createAuthWrapper(): HTMLDivElement {
    this.authWrapper = createBaseElement({
      cssClasses: [styles.authWrapper],
      tag: 'div',
    });

    this.authWrapper.append(this.linksWrapper, this.authDescription, this.createToRegisterPageWrapper());
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
      cssClasses: [styles.loginPage],
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

    this.linksWrapper.append(this.loginSpan, this.designElement, this.registerLink.getHTML());
    return this.linksWrapper;
  }

  private createLoginSpan(): HTMLSpanElement {
    this.loginSpan = createBaseElement({
      cssClasses: [styles.loginSpan],
      innerContent: PAGE_LINK_TEXT[getCurrentLanguage()].LOGIN,
      tag: 'span',
    });

    observeCurrentLanguage(this.loginSpan, PAGE_LINK_TEXT, PAGE_LINK_TEXT_KEY.LOGIN);

    return this.loginSpan;
  }

  private createRegisterLink(): LinkModel {
    this.registerLink = new LinkModel({
      attrs: {
        href: PAGE_ID.REGISTRATION_PAGE,
      },
      classes: [styles.registerLink],
      text: PAGE_LINK_TEXT[getCurrentLanguage()].REGISTRATION,
    });

    observeCurrentLanguage(this.registerLink.getHTML(), PAGE_LINK_TEXT, PAGE_LINK_TEXT_KEY.REGISTRATION);

    return this.registerLink;
  }

  private createToRegisterPageWrapper(): HTMLSpanElement {
    this.toRegisterPageWrapper = createBaseElement({
      cssClasses: [styles.toRegisterPageWrapper],
      innerContent: PAGE_ANSWER[getCurrentLanguage()].LOGIN,
      tag: 'span',
    });

    observeCurrentLanguage(this.toRegisterPageWrapper, PAGE_ANSWER, PAGE_ANSWER_KEY.LOGIN);

    return this.toRegisterPageWrapper;
  }

  public getAuthWrapper(): HTMLDivElement {
    return this.authWrapper;
  }

  public getHTML(): HTMLDivElement {
    return this.page;
  }

  public getRegisterLink(): LinkModel {
    return this.registerLink;
  }

  public getToRegisterPageWrapper(): HTMLSpanElement {
    return this.toRegisterPageWrapper;
  }
}
export default LoginPageView;
