import { TAG_NAMES } from '@/shared/constants/enums.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

import NOT_FOUND_PAGE_STYLES from './notFoundPageView.module.scss';

class NotFoundPageView {
  private page: HTMLDivElement;

  private parent: HTMLDivElement;

  constructor(parent: HTMLDivElement) {
    this.parent = parent;
    this.page = this.createHTML();
  }

  private createHTML(): HTMLDivElement {
    this.page = createBaseElement({
      cssClasses: [NOT_FOUND_PAGE_STYLES.notFoundPage],
      tag: TAG_NAMES.DIV,
    });

    this.parent.append(this.page);

    return this.page;
  }

  public getHTML(): HTMLDivElement {
    return this.page;
  }

  public hide(): boolean {
    this.page.classList.add(NOT_FOUND_PAGE_STYLES.notFoundPage_hidden);
    return true;
  }

  public show(): boolean {
    this.page.classList.remove(NOT_FOUND_PAGE_STYLES.notFoundPage_hidden);
    return true;
  }
}
export default NotFoundPageView;
