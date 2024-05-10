import createBaseElement from '@/shared/utils/createBaseElement.ts';

import styles from './footerView.module.scss';

class FooterView {
  private footer: HTMLElement;

  private wrapper: HTMLDivElement;

  constructor() {
    this.wrapper = this.createWrapper();
    this.footer = this.createHTML();
  }

  private createHTML(): HTMLElement {
    this.footer = createBaseElement({
      cssClasses: [styles.footer],
      tag: 'footer',
    });

    this.footer.append(this.wrapper);
    return this.footer;
  }

  private createWrapper(): HTMLDivElement {
    this.wrapper = createBaseElement({
      cssClasses: [styles.wrapper],
      tag: 'div',
    });

    return this.wrapper;
  }

  public getHTML(): HTMLElement {
    return this.footer;
  }

  public getWrapper(): HTMLDivElement {
    return this.wrapper;
  }
}

export default FooterView;
