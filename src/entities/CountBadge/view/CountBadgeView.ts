import createBaseElement from '@/shared/utils/createBaseElement.ts';

import styles from './countBadgeView.module.scss';

class CountBadgeView {
  private countBadge: HTMLSpanElement;

  private countBadgeWrap: HTMLDivElement;

  constructor() {
    this.countBadgeWrap = this.createHTML();
    this.countBadge = this.createBadge();
  }

  private createBadge(): HTMLSpanElement {
    this.countBadge = createBaseElement({
      cssClasses: [styles.badge],
      tag: 'span',
    });
    this.countBadgeWrap.append(this.countBadge);

    return this.countBadge;
  }

  private createHTML(): HTMLDivElement {
    this.countBadgeWrap = createBaseElement({
      cssClasses: [styles.badgeWrap],
      tag: 'div',
    });

    return this.countBadgeWrap;
  }

  public getHTML(): HTMLDivElement {
    return this.countBadgeWrap;
  }

  public updateBadgeCount(count?: number): void {
    if (!count) {
      this.countBadgeWrap.classList.add(styles.hidden);
    } else {
      this.countBadgeWrap.classList.remove(styles.hidden);
    }

    this.countBadge.textContent = count ? count.toString() : '';
  }
}

export default CountBadgeView;
