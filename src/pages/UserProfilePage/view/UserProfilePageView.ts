import clearOutElement from '@/shared/utils/clearOutElement.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

import styles from './userProfilePageView.module.scss';

class UserProfilePageView {
  private page: HTMLDivElement;

  private parent: HTMLDivElement;

  private userProfileWrapper: HTMLDivElement;

  constructor(parent: HTMLDivElement) {
    this.parent = parent;
    clearOutElement(this.parent);
    this.userProfileWrapper = this.createUserProfileWrapper();
    this.page = this.createHTML();
    window.scrollTo(0, 0);
  }

  private createHTML(): HTMLDivElement {
    this.page = createBaseElement({
      cssClasses: [styles.userProfilePage],
      tag: 'div',
    });

    this.page.append(this.userProfileWrapper);
    this.parent.append(this.page);

    return this.page;
  }

  private createUserProfileWrapper(): HTMLDivElement {
    this.userProfileWrapper = createBaseElement({
      cssClasses: [styles.userProfileWrapper],
      tag: 'div',
    });

    return this.userProfileWrapper;
  }

  public getHTML(): HTMLDivElement {
    return this.page;
  }

  public getUserProfileWrapper(): HTMLDivElement {
    return this.userProfileWrapper;
  }
}
export default UserProfilePageView;
