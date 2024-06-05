import type { Cart } from '@/shared/types/cart.ts';
import type { Page } from '@/shared/types/page.ts';

import getCartModel from '@/shared/API/cart/model/CartModel.ts';
import LoaderModel from '@/shared/Loader/model/LoaderModel.ts';
import serverMessageModel from '@/shared/ServerMessage/model/ServerMessageModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { setCurrentPage } from '@/shared/Store/actions.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import { MESSAGE_STATUS, SERVER_MESSAGE_KEYS } from '@/shared/constants/messages.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';
import { LOADER_SIZE } from '@/shared/constants/sizes.ts';
import showErrorMessage from '@/shared/utils/userMessage.ts';
import ProductOrderModel from '@/widgets/ProductOrder/model/ProductOrderModel.ts';

import CartPageView from '../view/CartPageView.ts';

class CartPageModel implements Page {
  private cart: Cart | null = null;

  private productsItem: ProductOrderModel[] = [];

  private view: CartPageView;

  constructor(parent: HTMLDivElement) {
    this.view = new CartPageView(parent, this.clearCart.bind(this), this.addDiscountHandler.bind(this));

    this.init().catch(showErrorMessage);
  }

  private async addDiscountHandler(discountCode: string): Promise<void> {
    if (discountCode.trim()) {
      const loader = new LoaderModel(LOADER_SIZE.SMALL).getHTML();
      this.view.getCouponButton().append(loader);
      await getCartModel()
        .addCoupon(discountCode)
        .then((cart) => {
          if (cart) {
            serverMessageModel.showServerMessage(
              SERVER_MESSAGE_KEYS.SUCCESSFUL_ADD_COUPON_TO_CART,
              MESSAGE_STATUS.SUCCESS,
            );
            this.cart = cart;
            this.view.updateTotal(this.cart);
          }
        })
        .catch(showErrorMessage)
        .finally(() => loader.remove());
    }
  }

  private changeProductHandler(cart: Cart): void {
    this.cart = cart;
    this.productsItem = this.productsItem.filter((productItem) => {
      const searchEl = this.cart?.products.find((item) => item.lineItemId === productItem.getProduct().lineItemId);
      if (!searchEl) {
        productItem.getHTML().remove();
        return false;
      }
      return true;
    });

    if (!this.productsItem.length) {
      this.view.renderEmpty();
    }
    this.view.updateTotal(this.cart);
  }

  private async clearCart(): Promise<void> {
    await getCartModel()
      .clearCart()
      .then((cart) => {
        this.cart = cart;
        serverMessageModel.showServerMessage(SERVER_MESSAGE_KEYS.SUCCESSFUL_CLEAR_CART, MESSAGE_STATUS.SUCCESS);
        this.productsItem = this.productsItem.filter((productItem) => {
          const searchEl = this.cart?.products.find((item) => item.lineItemId === productItem.getProduct().lineItemId);
          if (!searchEl) {
            productItem.getHTML().remove();
            return false;
          }
          return true;
        });
        this.renderCart();
      })
      .catch((error: Error) => {
        showErrorMessage(error);
        return this.cart;
      });
  }

  private async init(): Promise<void> {
    getStore().dispatch(setCurrentPage(PAGE_ID.CART_PAGE));
    this.cart = await getCartModel().addProductInfo();
    this.renderCart();
    observeStore(selectCurrentLanguage, () => this.view.updateLanguage());
  }

  private renderCart(): void {
    if (this.cart) {
      this.cart.products.forEach((product) => {
        this.productsItem.push(new ProductOrderModel(product, this.changeProductHandler.bind(this)));
      });

      if (this.productsItem.length) {
        this.view.renderCart(this.productsItem);
      } else {
        this.view.renderEmpty();
      }
      this.view.updateTotal(this.cart);
    }
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default CartPageModel;
