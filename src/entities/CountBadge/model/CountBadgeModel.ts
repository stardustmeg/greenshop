import type { ProductListType } from '@/shared/constants/product.ts';
import type { Cart } from '@/shared/types/cart.ts';
import type { ShoppingList } from '@/shared/types/shopping-list.ts';

import getCartModel from '@/shared/API/cart/model/CartModel.ts';
import getShoppingListModel from '@/shared/API/shopping-list/model/ShoppingListModel.ts';
import { PRODUCT_LIST } from '@/shared/constants/product.ts';

import CountBadgeView from '../view/CountBadgeView.ts';

class CountBadgeModel {
  private cartCount = 0;

  private shoppingListCount = 0;

  private type: ProductListType;

  private view = new CountBadgeView();

  constructor(type: ProductListType) {
    this.type = type;
    this.init();
  }

  private cartChangeHandler(cart: Cart): boolean {
    this.cartCount = cart.products.reduce((acc, item) => acc + item.quantity, 0);
    this.updateBadgeCount();
    return true;
  }

  private init(): void {
    this.observeCartChange();
    this.observeShoppingListChange();
  }

  private observeCartChange(): boolean {
    return getCartModel().observeCartChange(this.cartChangeHandler.bind(this));
  }

  private observeShoppingListChange(): void {
    getShoppingListModel().subscribe(this.shoppingListChangeHandler.bind(this));
  }

  private shoppingListChangeHandler(shoppingList: ShoppingList): void {
    this.shoppingListCount = shoppingList.products.length;
    this.updateBadgeCount();
  }

  private updateBadgeCount(): void {
    const currentCount = this.type === PRODUCT_LIST.CART ? this.cartCount : this.shoppingListCount;
    this.view.updateBadgeCount(currentCount);
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default CountBadgeModel;
