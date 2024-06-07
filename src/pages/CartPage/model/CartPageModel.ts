import type { Page } from '@/shared/types/page.ts';

import getCartModel from '@/shared/API/cart/model/CartModel.ts';
import LoaderModel from '@/shared/Loader/model/LoaderModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { setCurrentPage } from '@/shared/Store/actions.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import { SERVER_MESSAGE_KEYS } from '@/shared/constants/messages.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';
import { LOADER_SIZE } from '@/shared/constants/sizes.ts';
import { type Cart, CartActive } from '@/shared/types/cart.ts';
import { promoCodeAppliedMessage } from '@/shared/utils/messageTemplates.ts';
import { showErrorMessage, showSuccessMessage } from '@/shared/utils/userMessage.ts';
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
            showSuccessMessage(promoCodeAppliedMessage(discountCode));
            this.cart = cart;
            this.productsItem.forEach((productItem) => {
              const idLine = productItem.getProduct().lineItemId;
              const updateLine = this.cart?.products.find((item) => item.lineItemId === idLine);
              if (updateLine) {
                productItem.setProduct(updateLine);
                productItem.updateProductHandler(CartActive.UPDATE).catch(showErrorMessage);
              }
            });
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
        showSuccessMessage(SERVER_MESSAGE_KEYS.SUCCESSFUL_CLEAR_CART);
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
