import createBaseElement from '@/shared/utils/createBaseElement.ts';

import styles from './userProfilePageView.module.scss';

class UserProfilePageView {
  private page: HTMLDivElement;

  private parent: HTMLDivElement;

  constructor(parent: HTMLDivElement) {
    this.parent = parent;
    this.parent.innerHTML = '';
    this.page = this.createHTML();
  }

  private createHTML(): HTMLDivElement {
    this.page = createBaseElement({
      cssClasses: [styles.userProfilePage],
      tag: 'div',
    });

    this.parent.append(this.page);

    return this.page;
  }

  public getHTML(): HTMLDivElement {
    return this.page;
  }
}
export default UserProfilePageView;
