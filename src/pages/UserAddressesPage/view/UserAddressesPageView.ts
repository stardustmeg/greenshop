import clearOutElement from '@/shared/utils/clearOutElement.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

import styles from './userAddressesPageView.module.scss';

class UserAddressesPageView {
  private page: HTMLDivElement;

  private parent: HTMLDivElement;

  constructor(parent: HTMLDivElement) {
    this.parent = parent;
    clearOutElement(this.parent);
    this.page = this.createHTML();
    window.scrollTo(0, 0);
  }

  private createHTML(): HTMLDivElement {
    this.page = createBaseElement({
      cssClasses: [styles.userAddressesPage],
      tag: 'div',
    });

    this.parent.append(this.page);

    return this.page;
  }

  public getHTML(): HTMLDivElement {
    return this.page;
  }
}
export default UserAddressesPageView;
