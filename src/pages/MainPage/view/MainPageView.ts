import { PAGE_TIMEOUT_DURATION } from '@/shared/constants/animations.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

import styles from './mainPageView.module.scss';

class MainPageView {
  private page: HTMLDivElement;

  private parent: HTMLDivElement;

  constructor(parent: HTMLDivElement) {
    this.parent = parent;
    this.page = this.createHTML();
  }

  private createHTML(): HTMLDivElement {
    this.page = createBaseElement({
      cssClasses: [styles.mainPage],
      tag: 'div',
    });

    this.parent.append(this.page);

    return this.page;
  }

  public getHTML(): HTMLDivElement {
    return this.page;
  }

  public hide(): boolean {
    this.page.classList.add(styles.mainPage_hidden);
    return true;
  }

  public show(): boolean {
    setTimeout(() => {
      this.page.classList.remove(styles.mainPage_hidden);
    }, PAGE_TIMEOUT_DURATION);
    return true;
  }
}
export default MainPageView;
