import CountBadgeView from '../view/CountBadgeView.ts';

class CountBadgeModel {
  private view = new CountBadgeView();

  constructor() {
    this.updateBadgeCount();
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }

  public updateBadgeCount(quantity = 0): void {
    this.view.updateBadgeCount(quantity);
  }
}

export default CountBadgeModel;
