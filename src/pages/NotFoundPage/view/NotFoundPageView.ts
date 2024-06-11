import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import { BUTTON_TEXT, BUTTON_TEXT_KEYS } from '@/shared/constants/buttons.ts';
import { PAGE_DESCRIPTION, PAGE_DESCRIPTION_KEYS } from '@/shared/constants/pages.ts';
import SVG_DETAILS from '@/shared/constants/svg.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import createSVGUse from '@/shared/utils/createSVGUse.ts';
import getCurrentLanguage from '@/shared/utils/getCurrentLanguage.ts';
import observeCurrentLanguage from '@/shared/utils/observeCurrentLanguage.ts';

import styles from './notFoundPageView.module.scss';

class NotFoundPageView {
  private description: HTMLParagraphElement;

  private logo: HTMLDivElement;

  private page: HTMLDivElement;

  private parent: HTMLDivElement;

  private title: HTMLHeadingElement;

  private toMainButton: ButtonModel;

  constructor(parent: HTMLDivElement) {
    this.parent = parent;
    this.parent.innerHTML = '';
    this.logo = this.createPageLogo();
    this.title = this.createPageTitle();
    this.description = this.createPageDescription();
    this.toMainButton = this.createToMainButton();
    this.page = this.createHTML();
    window.scrollTo(0, 0);
  }

  private createHTML(): HTMLDivElement {
    this.page = createBaseElement({
      cssClasses: [styles.notFoundPage],
      tag: 'div',
    });

    this.page.append(this.logo, this.title, this.description, this.toMainButton.getHTML());
    this.parent.append(this.page);

    return this.page;
  }

  private createPageDescription(): HTMLParagraphElement {
    this.description = createBaseElement({
      cssClasses: [styles.pageDescription],
      innerContent: PAGE_DESCRIPTION[getCurrentLanguage()][404],
      tag: 'p',
    });

    observeCurrentLanguage(this.description, PAGE_DESCRIPTION, PAGE_DESCRIPTION_KEYS[404]);

    return this.description;
  }

  private createPageLogo(): HTMLDivElement {
    this.logo = createBaseElement({ cssClasses: [styles.pageLogo], tag: 'div' });
    const svg = document.createElementNS(SVG_DETAILS.SVG_URL, 'svg');
    svg.append(createSVGUse(SVG_DETAILS.LOGO));
    this.logo.append(svg);
    return this.logo;
  }

  private createPageTitle(): HTMLHeadingElement {
    this.title = createBaseElement({
      cssClasses: [styles.pageTitle],
      innerContent: PAGE_DESCRIPTION_KEYS[404],
      tag: 'h1',
    });
    return this.title;
  }

  private createToMainButton(): ButtonModel {
    this.toMainButton = new ButtonModel({
      classes: [styles.toMainButton],
      text: BUTTON_TEXT[getCurrentLanguage()].BACK_TO_MAIN,
    });
    observeCurrentLanguage(this.toMainButton.getHTML(), BUTTON_TEXT, BUTTON_TEXT_KEYS.BACK_TO_MAIN);
    return this.toMainButton;
  }

  public getHTML(): HTMLDivElement {
    return this.page;
  }

  public getToMainButton(): ButtonModel {
    return this.toMainButton;
  }
}

export default NotFoundPageView;
