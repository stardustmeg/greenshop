import type { LanguageChoiceType } from '@/shared/constants/common.ts';

import RouterModel from '@/app/Router/model/RouterModel.ts';
import CountBadgeModel from '@/entities/CountBadge/model/CountBadgeModel.ts';
import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import InputModel from '@/shared/Input/model/InputModel.ts';
import LinkModel from '@/shared/Link/model/LinkModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { switchAppTheme } from '@/shared/Store/actions.ts';
import observeStore, { selectCurrentPage, selectIsUserLoggedIn } from '@/shared/Store/observer.ts';
import { BUTTON_TEXT, BUTTON_TEXT_KEYS } from '@/shared/constants/buttons.ts';
import { LANGUAGE_CHOICE } from '@/shared/constants/common.ts';
import { INPUT_TYPE } from '@/shared/constants/forms.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';
import APP_THEME from '@/shared/constants/styles.ts';
import SVG_DETAILS from '@/shared/constants/svg.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import createSVGUse from '@/shared/utils/createSVGUse.ts';
import getCurrentLanguage from '@/shared/utils/getCurrentLanguage.ts';
import observeCurrentLanguage from '@/shared/utils/observeCurrentLanguage.ts';

import styles from './headerView.module.scss';

class HeaderView {
  private burgerButton: ButtonModel;

  private header: HTMLElement;

  private linkLogo: LinkModel;

  private logoutButton: ButtonModel;

  private navigationWrapper: HTMLDivElement;

  private switchLanguageCheckbox: InputModel;

  private switchThemeCheckbox: InputModel;

  private toAddressesLink: LinkModel;

  private toCartLink: LinkModel;

  private toProfileLink: LinkModel;

  private toWishlistLink: LinkModel;

  private wrapper: HTMLDivElement;

  constructor() {
    this.logoutButton = this.createLogoutButton();
    this.linkLogo = this.createLinkLogo();
    this.toCartLink = this.createToCartLink();
    this.toWishlistLink = this.createToWishlistLink();
    this.toProfileLink = this.createToProfileLink();
    this.toAddressesLink = this.createToAddressesLink();
    this.switchThemeCheckbox = this.createSwitchThemeCheckbox();
    this.switchLanguageCheckbox = this.createSwitchLanguageCheckbox();
    this.navigationWrapper = this.createNavigationWrapper();
    this.burgerButton = this.createBurgerButton();
    this.wrapper = this.createWrapper();
    this.header = this.createHTML();

    document.addEventListener('click', ({ target }) => {
      if (
        target !== this.navigationWrapper &&
        this.burgerButton.getHTML().classList.contains(styles.open) &&
        target !== this.burgerButton.getHTML() &&
        target !== this.switchThemeCheckbox.getHTML() &&
        target !== this.switchThemeCheckbox.getHTML().parentElement
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

  private createLanguageSVG(lang: LanguageChoiceType): SVGSVGElement {
    const svg = document.createElementNS(SVG_DETAILS.SVG_URL, 'svg');
    svg.append(createSVGUse(lang));
    return svg;
  }

  private createLinkLogo(): LinkModel {
    this.linkLogo = new LinkModel({
      attrs: {
        href: PAGE_ID.MAIN_PAGE,
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
      text: BUTTON_TEXT[getCurrentLanguage()].LOG_OUT,
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
      this.toProfileLink.getHTML(),
      this.toAddressesLink.getHTML(),
      this.createSwitchThemeLabel(),
      this.createSwitchLanguageLabel(),
      this.logoutButton.getHTML(),
    );

    return this.navigationWrapper;
  }

  private createSwitchLanguageCheckbox(): InputModel {
    this.switchLanguageCheckbox = new InputModel({
      id: styles.switchLanguageLabel,
      type: INPUT_TYPE.CHECK_BOX,
    });
    this.switchLanguageCheckbox.getHTML().classList.add(styles.switchLanguageCheckbox);
    this.switchLanguageCheckbox.getHTML().checked = getCurrentLanguage() === LANGUAGE_CHOICE.EN;

    return this.switchLanguageCheckbox;
  }

  private createSwitchLanguageLabel(): HTMLLabelElement {
    const label = createBaseElement({
      attributes: { for: styles.switchLanguageLabel },
      cssClasses: [styles.switchLanguageLabel, styles.switchLanguageLabelAbs],
      tag: 'label',
    });
    const span = createBaseElement({
      cssClasses: [styles.switchLanguageLabelSpan],
      tag: 'span',
    });
    const enSVG = this.createLanguageSVG(LANGUAGE_CHOICE.EN);
    enSVG.classList.add(styles.enSVG);
    const ruSVG = this.createLanguageSVG(LANGUAGE_CHOICE.RU);
    ruSVG.classList.add(styles.ruSVG);

    label.append(enSVG, ruSVG, this.switchLanguageCheckbox.getHTML(), span);
    return label;
  }

  private createSwitchThemeCheckbox(): InputModel {
    this.switchThemeCheckbox = new InputModel({
      id: styles.switchThemeLabel,
      type: INPUT_TYPE.CHECK_BOX,
    });
    this.switchThemeCheckbox.getHTML().classList.add(styles.switchThemeCheckbox);
    document.body.classList.add(getStore().getState().isAppThemeLight ? APP_THEME.LIGHT : APP_THEME.DARK);

    this.switchThemeCheckbox.getHTML().checked = getStore().getState().isAppThemeLight;

    this.switchThemeCheckbox.getHTML().addEventListener('click', () => {
      document.body.classList.toggle(APP_THEME.DARK);
      document.body.classList.toggle(APP_THEME.LIGHT);

      getStore().dispatch(switchAppTheme());
    });

    return this.switchThemeCheckbox;
  }

  private createSwitchThemeLabel(): HTMLLabelElement {
    const label = createBaseElement({
      attributes: { for: styles.switchThemeLabel },
      cssClasses: [styles.switchThemeLabel],
      tag: 'label',
    });
    const span = createBaseElement({
      cssClasses: [styles.switchThemeLabelSpan],
      tag: 'span',
    });
    const darkSVG = document.createElementNS(SVG_DETAILS.SVG_URL, 'svg');
    darkSVG.classList.add(styles.darkSVG);
    const lightSVG = document.createElementNS(SVG_DETAILS.SVG_URL, 'svg');
    lightSVG.classList.add(styles.lightSVG);
    darkSVG.append(createSVGUse(SVG_DETAILS.DARK));
    lightSVG.append(createSVGUse(SVG_DETAILS.LIGHT));

    label.append(darkSVG, lightSVG, this.switchThemeCheckbox.getHTML(), span);
    return label;
  }

  private createToAddressesLink(): LinkModel {
    this.toAddressesLink = new LinkModel({
      attrs: {
        href: PAGE_ID.USER_ADDRESSES_PAGE,
      },
      classes: [styles.addressesLink],
    });

    const svg = document.createElementNS(SVG_DETAILS.SVG_URL, 'svg');
    svg.append(createSVGUse(SVG_DETAILS.HOUSE));
    this.toAddressesLink.getHTML().append(svg);

    if (!getStore().getState().isUserLoggedIn) {
      this.toAddressesLink.getHTML().classList.add(styles.hidden);
    }

    observeStore(selectIsUserLoggedIn, () =>
      this.toAddressesLink.getHTML().classList.toggle(styles.hidden, !getStore().getState().isUserLoggedIn),
    );

    this.toAddressesLink
      .getHTML()
      .classList.toggle(styles.addressesLinkActive, RouterModel.getCurrentPage() === PAGE_ID.USER_ADDRESSES_PAGE);

    observeStore(selectCurrentPage, () =>
      this.toAddressesLink
        .getHTML()
        .classList.toggle(styles.addressesLinkActive, RouterModel.getCurrentPage() === PAGE_ID.USER_ADDRESSES_PAGE),
    );

    return this.toAddressesLink;
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
      .classList.toggle(styles.cartLinkActive, RouterModel.getCurrentPage() === PAGE_ID.CART_PAGE);

    observeStore(selectCurrentPage, () =>
      this.toCartLink
        .getHTML()
        .classList.toggle(styles.cartLinkActive, RouterModel.getCurrentPage() === PAGE_ID.CART_PAGE),
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

    if (!getStore().getState().isUserLoggedIn) {
      this.toProfileLink.getHTML().classList.add(styles.hidden);
    }

    observeStore(selectIsUserLoggedIn, () =>
      this.toProfileLink.getHTML().classList.toggle(styles.hidden, !getStore().getState().isUserLoggedIn),
    );

    this.toProfileLink
      .getHTML()
      .classList.toggle(styles.profileLinkActive, RouterModel.getCurrentPage() === PAGE_ID.USER_PROFILE_PAGE);

    observeStore(selectCurrentPage, () =>
      this.toProfileLink
        .getHTML()
        .classList.toggle(styles.profileLinkActive, RouterModel.getCurrentPage() === PAGE_ID.USER_PROFILE_PAGE),
    );

    return this.toProfileLink;
  }

  private createToWishlistLink(): LinkModel {
    this.toWishlistLink = new LinkModel({
      attrs: {
        href: PAGE_ID.CART_PAGE,
      },
      classes: [styles.wishListLink],
    });

    const svg = document.createElementNS(SVG_DETAILS.SVG_URL, 'svg');
    svg.append(createSVGUse(SVG_DETAILS.HEART));

    this.toWishlistLink.getHTML().append(svg);

    this.toWishlistLink
      .getHTML()
      .classList.toggle(styles.wishListLinkActive, RouterModel.getCurrentPage() === PAGE_ID.WISHLIST_PAGE);

    observeStore(selectCurrentPage, () =>
      this.toWishlistLink
        .getHTML()
        .classList.toggle(styles.wishListLinkActive, RouterModel.getCurrentPage() === PAGE_ID.WISHLIST_PAGE),
    );

    const wishlistBadge = new CountBadgeModel();
    this.toWishlistLink.getHTML().append(wishlistBadge.getHTML());

    return this.toWishlistLink;
  }

  private createWrapper(): HTMLDivElement {
    this.wrapper = createBaseElement({
      cssClasses: [styles.wrapper],
      tag: 'div',
    });

    this.wrapper.append(
      this.linkLogo.getHTML(),
      this.toCartLink.getHTML(),
      this.burgerButton.getHTML(),
      this.toWishlistLink.getHTML(),
    );
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

  public getNavigationWrapper(): HTMLDivElement {
    return this.navigationWrapper;
  }

  public getSwitchLanguageCheckbox(): InputModel {
    return this.switchLanguageCheckbox;
  }

  public getToAddressesLink(): LinkModel {
    return this.toAddressesLink;
  }

  public getToCartLink(): LinkModel {
    return this.toCartLink;
  }

  public getToProfileLink(): LinkModel {
    return this.toProfileLink;
  }

  public getToWishlistLink(): LinkModel {
    return this.toWishlistLink;
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
