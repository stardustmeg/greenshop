import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import { BUTTON_TEXT, BUTTON_TEXT_KEY } from '@/shared/constants/buttons.ts';
import { PAGE_DESCRIPTION, PAGE_DESCRIPTION_KEY } from '@/shared/constants/pages.ts';
import SVG_DETAIL from '@/shared/constants/svg.ts';
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

    this.observeStoreChanges();
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
    return createBaseElement({
      cssClasses: [styles.pageDescription],
      innerContent: PAGE_DESCRIPTION[getCurrentLanguage()][404],
      tag: 'p',
    });
  }

  private createPageLogo(): HTMLDivElement {
    this.logo = createBaseElement({ cssClasses: [styles.pageLogo], tag: 'div' });
    const svg = document.createElementNS(SVG_DETAIL.SVG_URL, 'svg');
    svg.append(createSVGUse(SVG_DETAIL.NOT_FOUND));
    this.logo.append(svg);
    return this.logo;
  }

  private createPageTitle(): HTMLHeadingElement {
    return createBaseElement({
      cssClasses: [styles.pageTitle],
      innerContent: PAGE_DESCRIPTION_KEY[404],
      tag: 'h1',
    });
  }

  private createToMainButton(): ButtonModel {
    return new ButtonModel({
      classes: [styles.toMainButton],
      text: BUTTON_TEXT[getCurrentLanguage()].BACK_TO_MAIN,
    });
  }

  private observeStoreChanges(): void {
    observeCurrentLanguage(this.description, PAGE_DESCRIPTION, PAGE_DESCRIPTION_KEY[404]);
    observeCurrentLanguage(this.toMainButton.getHTML(), BUTTON_TEXT, BUTTON_TEXT_KEY.BACK_TO_MAIN);
  }

  public getHTML(): HTMLDivElement {
    return this.page;
  }

  public getToMainButton(): ButtonModel {
    return this.toMainButton;
  }
}

export default NotFoundPageView;
