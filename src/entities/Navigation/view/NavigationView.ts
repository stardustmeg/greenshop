import TAG_NAME from '@/shared/constants/tags.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

import styles from './navigationView.module.scss';

class NavigationView {
  private navigation: HTMLElement;

  constructor() {
    this.navigation = this.createHTML();
  }

  private createHTML(): HTMLElement {
    this.navigation = createBaseElement({
      cssClasses: [styles.navigation],
      tag: TAG_NAME.NAV,
    });
    return this.navigation;
  }
}

export default NavigationView;
