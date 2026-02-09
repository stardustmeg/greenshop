import createBaseElement from '@/shared/utils/createBaseElement.ts';

import styles from './countBadgeView.module.scss';

class CountBadgeView {
  private countBadge: HTMLSpanElement;

  private countBadgeWrap: HTMLDivElement;

  constructor() {
    this.countBadge = this.createBadge();
    this.countBadgeWrap = this.createHTML();
  }

  private createBadge(): HTMLSpanElement {
    return createBaseElement({
      cssClasses: [styles.badge],
      tag: 'span',
    });
  }

  private createHTML(): HTMLDivElement {
    this.countBadgeWrap = createBaseElement({
      cssClasses: [styles.badgeWrap],
      tag: 'div',
    });

    this.countBadgeWrap.append(this.countBadge);

    return this.countBadgeWrap;
  }

  public getHTML(): HTMLDivElement {
    return this.countBadgeWrap;
  }

  public updateBadgeCount(count: number): void {
    this.countBadgeWrap.classList.toggle(styles.hidden, !count);
    this.countBadge.textContent = count.toString();
  }
}

export default CountBadgeView;
