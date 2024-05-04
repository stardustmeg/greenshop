import LinkModel from '@/shared/Link/model/LinkModel.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';
import TAG_NAME from '@/shared/constants/tags.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

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
      tag: TAG_NAME.NAV,
    });
    this.navigation.append(this.toMainLink.getHTML(), this.toLoginLink.getHTML(), this.toRegisterLink.getHTML());
    return this.navigation;
  }

  private createToLoginLink(): LinkModel {
    this.toLoginLink = new LinkModel({
      attrs: {
        href: PAGE_ID.LOGIN_PAGE,
      },
      classes: [styles.link],
      text: PAGE_ID.LOGIN_PAGE.toUpperCase(),
    });

    this.navigationLinks.set(PAGE_ID.LOGIN_PAGE, this.toLoginLink);
    return this.toLoginLink;
  }

  private createToMainLink(): LinkModel {
    this.toMainLink = new LinkModel({
      attrs: {
        href: PAGE_ID.MAIN_PAGE,
      },
      classes: [styles.link],
      text: PAGE_ID.MAIN_PAGE.toUpperCase(),
    });
    this.navigationLinks.set(PAGE_ID.MAIN_PAGE, this.toMainLink);
    return this.toMainLink;
  }

  private createToRegisterLink(): LinkModel {
    this.toRegisterLink = new LinkModel({
      attrs: {
        href: PAGE_ID.REGISTRATION_PAGE,
      },
      classes: [styles.link],
      text: PAGE_ID.REGISTRATION_PAGE.toUpperCase(),
    });
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
