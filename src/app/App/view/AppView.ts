import TAG_NAME from '@/shared/constants/tags.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

import styles from './appView.module.scss';

class AppView {
  private pagesContainer: HTMLDivElement;

  constructor() {
    this.pagesContainer = this.createHTML();
  }

  private createHTML(): HTMLDivElement {
    this.pagesContainer = createBaseElement({
      cssClasses: [styles.siteWrapper],
      tag: TAG_NAME.DIV,
    });

    return this.pagesContainer;
  }

  public getHTML(): HTMLDivElement {
    return this.pagesContainer;
  }
}

export default AppView;
