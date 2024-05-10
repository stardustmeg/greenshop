import type { Page } from '@/shared/types/common.ts';

import getStore from '@/shared/Store/Store.ts';
import { setCurrentPage } from '@/shared/Store/actions.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';

import CartPageView from '../view/CartPageView.ts';

class CartPageModel implements Page {
  private view: CartPageView;

  constructor(parent: HTMLDivElement) {
    this.view = new CartPageView(parent);
    this.init();
  }

  private init(): void {
    getStore().dispatch(setCurrentPage(PAGE_ID.CART_PAGE));
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default CartPageModel;
