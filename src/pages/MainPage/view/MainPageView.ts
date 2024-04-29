import { TAG_NAMES } from '@/shared/constants/enums.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

import MAIN_PAGE_STYLES from './mainPageView.module.scss';

class MainPageView {
  private page: HTMLDivElement;

  private parent: HTMLDivElement;

  constructor(parent: HTMLDivElement) {
    this.parent = parent;
    this.page = this.createHTML();
  }

  private createHTML(): HTMLDivElement {
    this.page = createBaseElement({
      cssClasses: [MAIN_PAGE_STYLES.mainPage],
      tag: TAG_NAMES.DIV,
    });

    this.parent.append(this.page);

    return this.page;
  }

  public getHTML(): HTMLDivElement {
    return this.page;
  }

  public hide(): boolean {
    this.page.classList.add(MAIN_PAGE_STYLES.mainPage_hidden);
    return true;
  }

  public show(): boolean {
    this.page.classList.remove(MAIN_PAGE_STYLES.mainPage_hidden);
    return true;
  }
}
export default MainPageView;
