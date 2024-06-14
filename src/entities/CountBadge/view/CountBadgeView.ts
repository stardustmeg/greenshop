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

  public updateBadgeCount(count: number): void {
    this.countBadgeWrap.classList.toggle(styles.hidden, !count);
    this.countBadge.textContent = count.toString();
  }
}

export default CountBadgeView;
