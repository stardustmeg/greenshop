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
      tag: 'div',
    });

    return this.pagesContainer;
  }

  public getHTML(): HTMLDivElement {
    return this.pagesContainer;
  }
}

export default AppView;
