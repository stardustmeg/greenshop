import type { Cart } from '@/shared/types/cart.ts';

import getCartModel from '@/shared/API/cart/model/CartModel.ts';

import CountBadgeView from '../view/CountBadgeView.ts';

class CountBadgeModel {
  private view = new CountBadgeView();

  constructor() {
    this.init();
  }

  private countChangeHandler(cart: Cart): boolean {
    this.view.updateBadgeCount(cart.products.reduce((acc, item) => acc + item.quantity, 0));
    return true;
  }

  private init(): void {
    this.observeCartChange();
  }

  private observeCartChange(): boolean {
    return getCartModel().observeCartChange(this.countChangeHandler.bind(this));
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default CountBadgeModel;
