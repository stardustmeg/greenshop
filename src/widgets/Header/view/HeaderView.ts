import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import LinkModel from '@/shared/Link/model/LinkModel.ts';
import getStore from '@/shared/Store/Store.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import { BUTTON_TEXT, BUTTON_TEXT_KEYS } from '@/shared/constants/buttons.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';
import SVG_DETAILS from '@/shared/constants/svg.ts';
import clearOutElement from '@/shared/utils/clearOutElement.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import createSVGUse from '@/shared/utils/createSVGUse.ts';
import observeCurrentLanguage from '@/shared/utils/observeCurrentLanguage.ts';

import styles from './headerView.module.scss';

class HeaderView {
  private header: HTMLElement;

  private linkLogo: LinkModel;

  private logoutButton: ButtonModel;

  private switchLanguageButton: ButtonModel;

  constructor() {
    this.logoutButton = this.createLogoutButton();
    this.linkLogo = this.createLinkLogo();
    this.switchLanguageButton = this.createSwitchLanguageButton();
    this.header = this.createHTML();
  }

  private createHTML(): HTMLElement {
    this.header = createBaseElement({
      cssClasses: [styles.header],
      tag: 'header',
    });

    this.header.append(this.linkLogo.getHTML(), this.switchLanguageButton.getHTML(), this.logoutButton.getHTML());
    return this.header;
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

  private createSwitchLanguageButton(): ButtonModel {
    this.switchLanguageButton = new ButtonModel({
      classes: [styles.switchLanguageButton],
    });
    const svg = document.createElementNS(SVG_DETAILS.SVG_URL, 'svg');
    svg.append(createSVGUse(SVG_DETAILS.SWITCH_LANGUAGE[getStore().getState().currentLanguage]));
    this.switchLanguageButton.getHTML().append(svg);

    observeStore(selectCurrentLanguage, () => {
      clearOutElement(this.switchLanguageButton.getHTML());
      this.switchLanguageButton.getHTML().append(this.createSwitchLanguageButton().getHTML());
    });

    return this.switchLanguageButton;
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
}

export default HeaderView;
