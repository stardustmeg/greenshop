import createBaseElement from '@/shared/utils/createBaseElement.ts';

import styles from './aboutUsPageView.module.scss';

class AboutUsPageView {
  private page: HTMLDivElement;

  private parent: HTMLDivElement;

  constructor(parent: HTMLDivElement) {
    this.parent = parent;
    this.parent.innerHTML = '';
    this.page = this.createHTML();
    window.scrollTo(0, 0);
  }

  private createHTML(): HTMLDivElement {
    this.page = createBaseElement({
      cssClasses: [styles.aboutUsPage],
      tag: 'div',
    });

    this.parent.append(this.page);

    return this.page;
  }

  public getHTML(): HTMLDivElement {
    return this.page;
  }
}
export default AboutUsPageView;
