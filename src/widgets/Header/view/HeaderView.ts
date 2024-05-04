import TAG_NAME from '@/shared/constants/tags.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

import styles from './headerView.module.scss';

class HeaderView {
  private header: HTMLElement;

  constructor() {
    this.header = this.createHTML();
  }

  private createHTML(): HTMLElement {
    this.header = createBaseElement({
      cssClasses: [styles.header],
      tag: TAG_NAME.HEADER,
    });
    return this.header;
  }

  public getHTML(): HTMLElement {
    return this.header;
  }
}

export default HeaderView;
