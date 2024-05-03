import TAG_NAME from '@/shared/constants/tags.ts';
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
      tag: TAG_NAME.DIV,
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
    this.page.classList.remove(styles.mainPage_hidden);
    return true;
  }
}
export default MainPageView;
