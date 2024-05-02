import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import { SVG_DETAILS, TAG_NAMES } from '@/shared/constants/enums.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import createSVGUse from '@/shared/utils/createSVGUse.ts';

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

    this.logo = this.createPageLogo();
    this.title = this.createPageTitle();
    this.description = this.createPageDescription();
    this.toMainButton = this.createToMainButton();

    this.page = this.createHTML();
  }

  private createHTML(): HTMLDivElement {
    this.page = createBaseElement({
      cssClasses: [styles.notFoundPage],
      tag: TAG_NAMES.DIV,
    });

    this.page.append(this.logo, this.title, this.description, this.toMainButton.getHTML());
    this.parent.append(this.page);

    return this.page;
  }

  private createPageDescription(): HTMLParagraphElement {
    this.description = createBaseElement({
      cssClasses: [styles.pageDescription],
      tag: TAG_NAMES.P,
    });
    return this.description;
  }

  private createPageLogo(): HTMLDivElement {
    this.logo = createBaseElement({ cssClasses: [styles.pageLogo], tag: TAG_NAMES.DIV });
    const svg = document.createElementNS(SVG_DETAILS.SVG_URL, TAG_NAMES.SVG);
    svg.append(createSVGUse(SVG_DETAILS.LOGO));

    this.logo.append(svg);

    return this.logo;
  }

  private createPageTitle(): HTMLHeadingElement {
    this.title = createBaseElement({
      cssClasses: [styles.pageTitle],
      innerContent: '404',
      tag: TAG_NAMES.H1,
    });
    return this.title;
  }

  private createToMainButton(): ButtonModel {
    this.toMainButton = new ButtonModel({ classes: [styles.toMainButton], text: 'Go Back' });
    return this.toMainButton;
  }

  public getHTML(): HTMLDivElement {
    return this.page;
  }

  public getToMainButton(): ButtonModel {
    return this.toMainButton;
  }

  public hide(): boolean {
    this.page.classList.add(styles.notFoundPage_hidden);
    return true;
  }

  public setPageDescription(text: string): HTMLParagraphElement {
    this.description.innerText = text;
    return this.description;
  }

  public show(): boolean {
    this.page.classList.remove(styles.notFoundPage_hidden);
    return true;
  }
}
export default NotFoundPageView;
