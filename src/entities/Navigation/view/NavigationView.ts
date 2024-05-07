import LinkModel from '@/shared/Link/model/LinkModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { PAGE_ID, PAGE_LINK_TEXT, PAGE_LINK_TEXT_KEYS } from '@/shared/constants/pages.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import observeCurrentLanguage from '@/shared/utils/observeCurrentLanguage.ts';

import styles from './navigationView.module.scss';

class NavigationView {
  private navigation: HTMLElement;

  private navigationLinks: Map<string, LinkModel> = new Map();

  private toLoginLink: LinkModel;

  private toMainLink: LinkModel;

  private toRegisterLink: LinkModel;

  constructor() {
    this.toMainLink = this.createToMainLink();
    this.toLoginLink = this.createToLoginLink();
    this.toRegisterLink = this.createToRegisterLink();
    this.navigation = this.createHTML();
  }

  private createHTML(): HTMLElement {
    this.navigation = createBaseElement({
      cssClasses: [styles.navigation],
      tag: 'nav',
    });
    this.navigation.append(this.toMainLink.getHTML(), this.toLoginLink.getHTML(), this.toRegisterLink.getHTML());
    return this.navigation;
  }

  private createToLoginLink(): LinkModel {
    const { currentLanguage } = getStore().getState();
    this.toLoginLink = new LinkModel({
      attrs: {
        href: PAGE_ID.LOGIN_PAGE,
      },
      classes: [styles.link],
      text: PAGE_LINK_TEXT[currentLanguage].LOGIN,
    });

    observeCurrentLanguage(this.toLoginLink.getHTML(), PAGE_LINK_TEXT, PAGE_LINK_TEXT_KEYS.LOGIN);

    this.navigationLinks.set(PAGE_ID.LOGIN_PAGE, this.toLoginLink);
    return this.toLoginLink;
  }

  private createToMainLink(): LinkModel {
    const { currentLanguage } = getStore().getState();
    this.toMainLink = new LinkModel({
      attrs: {
        href: PAGE_ID.MAIN_PAGE,
      },
      classes: [styles.link],
      text: PAGE_LINK_TEXT[currentLanguage].MAIN,
    });

    observeCurrentLanguage(this.toMainLink.getHTML(), PAGE_LINK_TEXT, PAGE_LINK_TEXT_KEYS.MAIN);

    this.navigationLinks.set(PAGE_ID.MAIN_PAGE, this.toMainLink);
    return this.toMainLink;
  }

  private createToRegisterLink(): LinkModel {
    const { currentLanguage } = getStore().getState();
    this.toRegisterLink = new LinkModel({
      attrs: {
        href: PAGE_ID.REGISTRATION_PAGE,
      },
      classes: [styles.link],
      text: PAGE_LINK_TEXT[currentLanguage].REGISTRATION,
    });

    observeCurrentLanguage(this.toRegisterLink.getHTML(), PAGE_LINK_TEXT, PAGE_LINK_TEXT_KEYS.REGISTRATION);

    this.navigationLinks.set(PAGE_ID.REGISTRATION_PAGE, this.toRegisterLink);
    return this.toRegisterLink;
  }

  public getHTML(): HTMLElement {
    return this.navigation;
  }

  public getNavigationLinks(): Map<string, LinkModel> {
    return this.navigationLinks;
  }

  public switchActiveLink(route: string): void {
    this.navigationLinks.forEach((link) => {
      link.getHTML().classList.remove(styles.active);
    });

    this.navigationLinks.get(route)?.getHTML().classList.add(styles.active);
  }
}

export default NavigationView;
