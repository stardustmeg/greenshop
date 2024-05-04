import TAG_NAME from '@/shared/constants/tags.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

import styles from './footerView.module.scss';

class FooterView {
  private footer: HTMLElement;

  constructor() {
    this.footer = this.createHTML();
  }

  private createHTML(): HTMLElement {
    this.footer = createBaseElement({
      cssClasses: [styles.footer],
      tag: TAG_NAME.FOOTER,
    });
    return this.footer;
  }

  public getHTML(): HTMLElement {
    return this.footer;
  }
}

export default FooterView;
