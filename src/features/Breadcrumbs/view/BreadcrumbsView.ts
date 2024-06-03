import type { BreadCrumbLink } from '@/shared/types/link';

import RouterModel from '@/app/Router/model/RouterModel.ts';
import LinkModel from '@/shared/Link/model/LinkModel.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import { formattedTextForMainAndCatalog } from '@/shared/utils/formattedText.ts';

import styles from './breadcrumbsView.module.scss';

const DELIMITER = '>';

class BreadcrumbsView {
  private view: HTMLDivElement;

  constructor(navigationLinks: BreadCrumbLink[]) {
    this.view = this.createHTML(navigationLinks);
  }

  private createHTML(navigationLinks: BreadCrumbLink[]): HTMLDivElement {
    this.view = createBaseElement({
      cssClasses: [styles.breadcrumbs],
      tag: 'div',
    });

    navigationLinks.forEach((linkParams) => {
      this.createLink(linkParams).getHTML();
    });

    this.view.lastChild?.remove();
    this.view.lastElementChild?.classList.add(styles.active);

    return this.view;
  }

  private createLink(linkParams: BreadCrumbLink): LinkModel {
    const link = new LinkModel({
      attrs: {
        href: linkParams.link,
      },
      classes: [styles.link],
      text: formattedTextForMainAndCatalog(linkParams.name),
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

    this.view.append(link.getHTML());
    this.view.append(delimiter);

    return link;
  }

  public getHTML(): HTMLDivElement {
    return this.view;
  }
}

export default BreadcrumbsView;
