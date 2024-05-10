import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import LinkModel from '@/shared/Link/model/LinkModel.ts';
import getStore from '@/shared/Store/Store.ts';
import observeStore, { selectCurrentLanguage, selectCurrentPage, selectCurrentUser } from '@/shared/Store/observer.ts';
import { BUTTON_TEXT, BUTTON_TEXT_KEYS } from '@/shared/constants/buttons.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';
import SVG_DETAILS from '@/shared/constants/svg.ts';
import clearOutElement from '@/shared/utils/clearOutElement.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import createSVGUse from '@/shared/utils/createSVGUse.ts';
import observeCurrentLanguage from '@/shared/utils/observeCurrentLanguage.ts';

import styles from './headerView.module.scss';

class HeaderView {
  private burgerButton: ButtonModel;

  private header: HTMLElement;

  private linkLogo: LinkModel;

  private logoutButton: ButtonModel;

  private navigationWrapper: HTMLDivElement;

  private switchLanguageButton: ButtonModel;

  private toCartLink: LinkModel;

  private toProfileLink: LinkModel;

  private wrapper: HTMLDivElement;

  constructor() {
    this.logoutButton = this.createLogoutButton();
    this.linkLogo = this.createLinkLogo();
    this.toCartLink = this.createToCartLink();
    this.toProfileLink = this.createToProfileLink();
    this.switchLanguageButton = this.createSwitchLanguageButton();
    this.navigationWrapper = this.createNavigationWrapper();
    this.burgerButton = this.createBurgerButton();
    this.wrapper = this.createWrapper();
    this.header = this.createHTML();

    document.addEventListener('click', ({ target }) => {
      if (
        target !== this.navigationWrapper &&
        this.burgerButton.getHTML().classList.contains(styles.open) &&
        target !== this.burgerButton.getHTML()
      ) {
        this.burgerButton.getHTML().classList.toggle(styles.open);
        this.navigationWrapper.classList.toggle(styles.open);
        document.body.classList.toggle(styles.stopScroll);
      }
    });
  }

  private createBurgerButton(): ButtonModel {
    this.burgerButton = new ButtonModel({
      classes: [styles.burgerButton],
    });

    const burgerLine1 = createBaseElement({
      cssClasses: [styles.burgerLine],
      tag: 'span',
    });
    const burgerLine2 = createBaseElement({
      cssClasses: [styles.burgerLine],
      tag: 'span',
    });
    const burgerLine3 = createBaseElement({
      cssClasses: [styles.burgerLine],
      tag: 'span',
    });

    this.burgerButton.getHTML().addEventListener('click', () => {
      this.burgerButton.getHTML().classList.toggle(styles.open);
      this.navigationWrapper.classList.toggle(styles.open);
      document.body.classList.toggle(styles.stopScroll);
    });

    this.burgerButton.getHTML().append(burgerLine1, burgerLine2, burgerLine3);

    return this.burgerButton;
  }

  private createHTML(): HTMLElement {
    this.header = createBaseElement({
      cssClasses: [styles.header],
      tag: 'header',
    });

    this.header.append(this.wrapper);
    return this.header;
  }

  private createLanguageButtonSVG(): SVGSVGElement {
    const svg = document.createElementNS(SVG_DETAILS.SVG_URL, 'svg');
    svg.append(createSVGUse(SVG_DETAILS.SWITCH_LANGUAGE[getStore().getState().currentLanguage]));
    return svg;
  }

  private createLinkLogo(): LinkModel {
    this.linkLogo = new LinkModel({
      attrs: {
        href: PAGE_ID.DEFAULT_PAGE,
      },
      classes: [styles.logo],
    });

    const svg = document.createElementNS(SVG_DETAILS.SVG_URL, 'svg');
    svg.append(createSVGUse(SVG_DETAILS.LOGO));
    this.linkLogo.getHTML().append(svg);
    return this.linkLogo;
  }

  private createLogoutButton(): ButtonModel {
    this.logoutButton = new ButtonModel({
      classes: [styles.logoutButton],
      text: BUTTON_TEXT[getStore().getState().currentLanguage].LOG_OUT,
    });

    observeCurrentLanguage(this.logoutButton.getHTML(), BUTTON_TEXT, BUTTON_TEXT_KEYS.LOG_OUT);

    return this.logoutButton;
  }

  private createNavigationWrapper(): HTMLDivElement {
    this.navigationWrapper = createBaseElement({
      cssClasses: [styles.navigationWrapper],
      tag: 'div',
    });
    this.navigationWrapper.append(
      this.switchLanguageButton.getHTML(),
      this.logoutButton.getHTML(),
      this.toCartLink.getHTML(),
      this.toProfileLink.getHTML(),
    );

    return this.navigationWrapper;
  }

  private createSwitchLanguageButton(): ButtonModel {
    this.switchLanguageButton = new ButtonModel({
      classes: [styles.switchLanguageButton],
    });

    this.switchLanguageButton.getHTML().append(this.createLanguageButtonSVG());

    observeStore(selectCurrentLanguage, () => {
      clearOutElement(this.switchLanguageButton.getHTML());
      this.switchLanguageButton.getHTML().append(this.createLanguageButtonSVG());
    });

    return this.switchLanguageButton;
  }

  private createToCartLink(): LinkModel {
    this.toCartLink = new LinkModel({
      attrs: {
        href: PAGE_ID.CART_PAGE,
      },
      classes: [styles.cartLink],
    });

    const svg = document.createElementNS(SVG_DETAILS.SVG_URL, 'svg');
    svg.append(createSVGUse(SVG_DETAILS.CART));
    this.toCartLink.getHTML().append(svg);

    this.toCartLink
      .getHTML()
      .classList.toggle(styles.cartLinkActive, getStore().getState().currentPage === PAGE_ID.CART_PAGE);

    observeStore(selectCurrentPage, () =>
      this.toCartLink
        .getHTML()
        .classList.toggle(styles.cartLinkActive, getStore().getState().currentPage === PAGE_ID.CART_PAGE),
    );

    return this.toCartLink;
  }

  private createToProfileLink(): LinkModel {
    this.toProfileLink = new LinkModel({
      attrs: {
        href: PAGE_ID.USER_PROFILE_PAGE,
      },
      classes: [styles.profileLink],
    });

    const svg = document.createElementNS(SVG_DETAILS.SVG_URL, 'svg');
    svg.append(createSVGUse(SVG_DETAILS.PROFILE));
    this.toProfileLink.getHTML().append(svg);

    if (!getStore().getState().currentUser) {
      this.toProfileLink.getHTML().classList.add(styles.hidden);
    }

    observeStore(selectCurrentUser, () =>
      this.toProfileLink.getHTML().classList.toggle(styles.hidden, getStore().getState().currentUser === null),
    );

    this.toProfileLink
      .getHTML()
      .classList.toggle(styles.profileLinkActive, getStore().getState().currentPage === PAGE_ID.USER_PROFILE_PAGE);

    observeStore(selectCurrentPage, () =>
      this.toProfileLink
        .getHTML()
        .classList.toggle(styles.profileLinkActive, getStore().getState().currentPage === PAGE_ID.USER_PROFILE_PAGE),
    );

    return this.toProfileLink;
  }

  private createWrapper(): HTMLDivElement {
    this.wrapper = createBaseElement({
      cssClasses: [styles.wrapper],
      tag: 'div',
    });

    this.wrapper.append(this.linkLogo.getHTML(), this.navigationWrapper, this.burgerButton.getHTML());
    return this.wrapper;
  }

  public getBurgerButton(): ButtonModel {
    return this.burgerButton;
  }

  public getHTML(): HTMLElement {
    return this.header;
  }

  public getLinkLogo(): LinkModel {
    return this.linkLogo;
  }

  public getLogoutButton(): ButtonModel {
    return this.logoutButton;
  }

  public getSwitchLanguageButton(): ButtonModel {
    return this.switchLanguageButton;
  }

  public getToCartLink(): LinkModel {
    return this.toCartLink;
  }

  public getToProfileLink(): LinkModel {
    return this.toProfileLink;
  }

  public getWrapper(): HTMLDivElement {
    return this.wrapper;
  }

  public hideNavigationWrapper(): void {
    this.navigationWrapper.classList.add(styles.hidden);
  }

  public showNavigationWrapper(): void {
    this.navigationWrapper.classList.remove(styles.hidden);
  }
}

export default HeaderView;
