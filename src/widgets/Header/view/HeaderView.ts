import type { LanguageChoiceType } from '@/shared/constants/buttons.ts';

import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import InputModel from '@/shared/Input/model/InputModel.ts';
import LinkModel from '@/shared/Link/model/LinkModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { switchAppTheme } from '@/shared/Store/actions.ts';
import observeStore, { selectCurrentPage, selectCurrentUser } from '@/shared/Store/observer.ts';
import { BUTTON_TEXT, BUTTON_TEXT_KEYS, LANGUAGE_CHOICE } from '@/shared/constants/buttons.ts';
import { AUTOCOMPLETE_OPTION } from '@/shared/constants/common.ts';
import { INPUT_TYPE } from '@/shared/constants/forms.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';
import APP_THEME from '@/shared/constants/styles.ts';
import SVG_DETAILS from '@/shared/constants/svg.ts';
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

  private switchLanguageCheckbox: InputModel;

  private switchThemeCheckbox: InputModel;

  private toCartLink: LinkModel;

  private toProfileLink: LinkModel;

  private wrapper: HTMLDivElement;

  constructor() {
    this.logoutButton = this.createLogoutButton();
    this.linkLogo = this.createLinkLogo();
    this.toCartLink = this.createToCartLink();
    this.toProfileLink = this.createToProfileLink();
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
      this.createSwitchLanguageLabel(),
      this.logoutButton.getHTML(),
      this.toCartLink.getHTML(),
      this.toProfileLink.getHTML(),
      this.createSwitchThemeLabel(),
    );

    return this.navigationWrapper;
  }

  private createSwitchLanguageCheckbox(): InputModel {
    this.switchLanguageCheckbox = new InputModel({
      autocomplete: AUTOCOMPLETE_OPTION.OFF,
      id: styles.switchLanguageLabel,
      placeholder: '',
      type: INPUT_TYPE.CHECK_BOX,
    });
    this.switchLanguageCheckbox.getHTML().classList.add(styles.switchLanguageCheckbox);
    this.switchLanguageCheckbox.getHTML().checked = getStore().getState().currentUser?.locale === LANGUAGE_CHOICE.EN;

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
      autocomplete: AUTOCOMPLETE_OPTION.OFF,
      id: styles.switchThemeLabel,
      placeholder: '',
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

    this.wrapper.append(this.linkLogo.getHTML(), this.burgerButton.getHTML());
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
