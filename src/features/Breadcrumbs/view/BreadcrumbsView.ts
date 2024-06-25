import type { BreadcrumbLink } from '@/shared/types/link';

import RouterModel from '@/app/Router/model/RouterModel.ts';
import LinkModel from '@/shared/Link/model/LinkModel.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import formattedText from '@/shared/utils/formattedText.ts';

import styles from './breadcrumbsView.module.scss';

const DELIMITER = '>';

class BreadcrumbsView {
  private view: HTMLDivElement;

  constructor() {
    this.view = this.createHTML();
  }

  private createHTML(): HTMLDivElement {
    this.view = createBaseElement({
      cssClasses: [styles.breadcrumbs],
      tag: 'div',
    });

    return this.view;
  }

  public clearBreadcrumbLinks(): void {
    this.view.innerHTML = '';
  }

  public drawLinks(linksData: BreadcrumbLink[]): void {
    this.clearBreadcrumbLinks();
    linksData.forEach((linkParams) => {
      const link = new LinkModel({
        attrs: {
          href: linkParams.link,
        },
        classes: [styles.link],
        text: formattedText(linkParams.name),
      });

      link.getHTML().addEventListener('click', (event) => {
        event.preventDefault();
        RouterModel.getInstance().navigateTo(linkParams.link);
      });

      const delimiter = createBaseElement({
        cssClasses: [styles.delimiter],
        innerContent: DELIMITER,
        tag: 'span',
      });

      this.view.append(link.getHTML(), delimiter);
    });

    this.view.lastChild?.remove();
    this.view.lastElementChild?.classList.add(styles.active);
  }

  public getHTML(): HTMLDivElement {
    return this.view;
  }
}

export default BreadcrumbsView;
