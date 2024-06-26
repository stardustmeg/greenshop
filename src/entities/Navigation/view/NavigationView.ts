import LinkModel from '@/shared/Link/model/LinkModel.ts';
import { PAGE_LINK_TEXT, PAGE_LINK_TEXT_KEY } from '@/shared/constants/links.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import getCurrentLanguage from '@/shared/utils/getCurrentLanguage.ts';
import observeCurrentLanguage from '@/shared/utils/observeCurrentLanguage.ts';

import styles from './navigationView.module.scss';

class NavigationView {
  private navigation: HTMLElement;

  private navigationLinks: Map<string, LinkModel> = new Map();

  private toAboutLink: LinkModel;

  private toBlogLink: LinkModel;

  private toCatalogLink: LinkModel;

  private toLoginLink: LinkModel;

  private toMainLink: LinkModel;

  private toRegisterLink: LinkModel;

  constructor() {
    this.toMainLink = this.createToMainLink();
    this.toLoginLink = this.createToLoginLink();
    this.toRegisterLink = this.createToRegisterLink();
    this.toCatalogLink = this.createToCatalogLink();
    this.toAboutLink = this.createToAboutLink();
    this.toBlogLink = this.createToBlogLink();
    this.navigation = this.createHTML();
  }

  private createHTML(): HTMLElement {
    this.navigation = createBaseElement({
      cssClasses: [styles.navigation],
      tag: 'nav',
    });
    this.navigation.append(
      this.toLoginLink.getHTML(),
      this.toRegisterLink.getHTML(),
      this.toMainLink.getHTML(),
      this.toCatalogLink.getHTML(),
      this.toBlogLink.getHTML(),
      this.toAboutLink.getHTML(),
    );
    return this.navigation;
  }

  private createToAboutLink(): LinkModel {
    this.toAboutLink = new LinkModel({
      attrs: {
        href: PAGE_ID.ABOUT_US_PAGE,
      },
      classes: [styles.link],
      text: PAGE_LINK_TEXT[getCurrentLanguage()].ABOUT,
    });

    observeCurrentLanguage(this.toAboutLink.getHTML(), PAGE_LINK_TEXT, PAGE_LINK_TEXT_KEY.ABOUT);

    this.navigationLinks.set(PAGE_ID.ABOUT_US_PAGE, this.toAboutLink);
    return this.toAboutLink;
  }

  private createToBlogLink(): LinkModel {
    this.toBlogLink = new LinkModel({
      attrs: {
        href: PAGE_ID.BLOG,
      },
      classes: [styles.link],
      text: PAGE_LINK_TEXT[getCurrentLanguage()].BLOG,
    });

    observeCurrentLanguage(this.toBlogLink.getHTML(), PAGE_LINK_TEXT, PAGE_LINK_TEXT_KEY.BLOG);

    this.navigationLinks.set(PAGE_ID.BLOG, this.toBlogLink);
    return this.toBlogLink;
  }

  private createToCatalogLink(): LinkModel {
    this.toCatalogLink = new LinkModel({
      attrs: {
        href: PAGE_ID.CATALOG_PAGE,
      },
      classes: [styles.link],
      text: PAGE_LINK_TEXT[getCurrentLanguage()].CATALOG,
    });

    observeCurrentLanguage(this.toCatalogLink.getHTML(), PAGE_LINK_TEXT, PAGE_LINK_TEXT_KEY.CATALOG);

    this.navigationLinks.set(PAGE_ID.CATALOG_PAGE, this.toCatalogLink);
    return this.toCatalogLink;
  }

  private createToLoginLink(): LinkModel {
    this.toLoginLink = new LinkModel({
      attrs: {
        href: PAGE_ID.LOGIN_PAGE,
      },
      classes: [styles.link],
      text: PAGE_LINK_TEXT[getCurrentLanguage()].LOGIN,
    });

    observeCurrentLanguage(this.toLoginLink.getHTML(), PAGE_LINK_TEXT, PAGE_LINK_TEXT_KEY.LOGIN);

    this.navigationLinks.set(PAGE_ID.LOGIN_PAGE, this.toLoginLink);
    return this.toLoginLink;
  }

  private createToMainLink(): LinkModel {
    this.toMainLink = new LinkModel({
      attrs: {
        href: PAGE_ID.MAIN_PAGE,
      },
      classes: [styles.link],
      text: PAGE_LINK_TEXT[getCurrentLanguage()].MAIN,
    });

    observeCurrentLanguage(this.toMainLink.getHTML(), PAGE_LINK_TEXT, PAGE_LINK_TEXT_KEY.MAIN);

    this.navigationLinks.set(PAGE_ID.MAIN_PAGE, this.toMainLink);
    return this.toMainLink;
  }

  private createToRegisterLink(): LinkModel {
    this.toRegisterLink = new LinkModel({
      attrs: {
        href: PAGE_ID.REGISTRATION_PAGE,
      },
      classes: [styles.link],
      text: PAGE_LINK_TEXT[getCurrentLanguage()].REGISTRATION,
    });

    observeCurrentLanguage(this.toRegisterLink.getHTML(), PAGE_LINK_TEXT, PAGE_LINK_TEXT_KEY.REGISTRATION);

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
