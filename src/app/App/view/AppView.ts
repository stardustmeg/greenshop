import { TAG_NAMES } from '@/shared/constants/enums.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

import APP_STYLES from './appView.module.scss';

class AppView {
  private pagesContainer: HTMLDivElement;

  constructor() {
    this.pagesContainer = this.createHTML();
  }

  private createHTML(): HTMLDivElement {
    this.pagesContainer = createBaseElement({
      cssClasses: [APP_STYLES.siteWrapper],
      tag: TAG_NAMES.DIV,
    });

    return this.pagesContainer;
  }

  public getHTML(): HTMLDivElement {
    return this.pagesContainer;
  }
}

export default AppView;
