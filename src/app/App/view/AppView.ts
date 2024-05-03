import { TAG_NAMES } from '@/shared/constants/enums.ts';
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
      tag: TAG_NAMES.DIV,
    });

    return this.pagesContainer;
  }

  public getHTML(): HTMLDivElement {
    return this.pagesContainer;
  }
}

export default AppView;
