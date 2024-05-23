import type { Cart } from '@/shared/types/cart.ts';
import type { Page } from '@/shared/types/page.ts';

import getCartModel from '@/shared/API/cart/model/CartModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { setCurrentPage } from '@/shared/Store/actions.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';
import showErrorMessage from '@/shared/utils/userMessage.ts';
import ProductOrderModel from '@/widgets/ProductOrder/model/ProductOrderModel.ts';

import CartPageView from '../view/CartPageView.ts';

class CartPageModel implements Page {
  private cart: Cart | null = null;

  private productsItem: ProductOrderModel[] = [];

  private view: CartPageView;

  constructor(parent: HTMLDivElement) {
    this.view = new CartPageView(parent);

    this.init().catch(showErrorMessage);
  }

  private async init(): Promise<void> {
    getStore().dispatch(setCurrentPage(PAGE_ID.CART_PAGE));
    this.cart = await getCartModel().addProductInfo();
    this.cart.products.forEach((product) => {
      this.productsItem.push(new ProductOrderModel(product));
    });

    this.view.renderCart(this.productsItem);
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default CartPageModel;
