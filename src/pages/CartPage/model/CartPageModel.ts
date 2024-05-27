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

  private changeProductHandler = (cart: Cart): void => {
    this.cart = cart;
    this.view.updateTotal(this.cart);
  };

  private clearCart = async (): Promise<void> => {
    // const actions = this.cart?.products.map(lineItem => ({
    //   action: 'removeLineItem',
    //   lineItemId: lineItem.lineItemId,
    // }));
    this.cart = await getCartModel().clearCart();
    this.productsItem = this.productsItem.filter((productItem) => {
      const searchEl = this.cart?.products.find((item) => item.lineItemId === productItem.getProduct().lineItemId);
      if (!searchEl) {
        productItem.getHTML().remove();
        return false;
      }
      return true;
    });
    this.renderCart();
  };

  private productsItem: ProductOrderModel[] = [];

  private view: CartPageView;

  constructor(parent: HTMLDivElement) {
    this.view = new CartPageView(parent, this.clearCart);

    this.init().catch(showErrorMessage);
  }

  private async init(): Promise<void> {
    getStore().dispatch(setCurrentPage(PAGE_ID.CART_PAGE));
    this.cart = await getCartModel().addProductInfo();
    this.renderCart();
    // this.cart.products.forEach((product) => {
    //   this.productsItem.push(new ProductOrderModel(product, this.changeProductHandler));
    // });

    // this.view.renderCart(this.productsItem);
    // this.view.updateTotal(this.cart);
  }

  private renderCart(): void {
    if (this.cart) {
      this.cart.products.forEach((product) => {
        this.productsItem.push(new ProductOrderModel(product, this.changeProductHandler));
      });

      this.view.renderCart(this.productsItem);
      this.view.updateTotal(this.cart);
    }
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default CartPageModel;
