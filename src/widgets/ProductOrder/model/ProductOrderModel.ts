import type { Cart, CartProduct, EditCartItem } from '@/shared/types/cart.ts';

import getCartModel from '@/shared/API/cart/model/CartModel.ts';
import { CartActive } from '@/shared/types/cart.ts';

import ProductOrderView from '../view/ProductOrderView.ts';

type Callback = (cart: Cart) => void;

class ProductOrderModel {
  private callback: Callback;

  private productItem: CartProduct;

  private view: ProductOrderView;

  constructor(productItem: CartProduct, callback: Callback) {
    this.callback = callback;
    this.productItem = productItem;
    this.view = new ProductOrderView(this.productItem, this.updateProductHandler.bind(this));
    this.init();
  }

  private init(): void {}

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }

  public getProduct(): CartProduct {
    return this.productItem;
  }

  public async updateProductHandler(active: CartActive): Promise<void> {
    let updateItem: CartProduct | undefined;
    let cart: Cart | null = null;
    switch (active) {
      case CartActive.DELETE: {
        cart = await getCartModel().deleteProductFromCart(this.productItem);
        updateItem = cart.products.find((item) => item.lineItemId === this.productItem.lineItemId);
        break;
      }

      case CartActive.MINUS: {
        const active: EditCartItem = {
          lineId: this.productItem.lineItemId,
          quantity: this.productItem.quantity - 1,
        };
        cart = await getCartModel().editProductCount(active);
        updateItem = cart.products.find((item) => item.lineItemId === this.productItem.lineItemId);
        break;
      }
      case CartActive.PLUS: {
        const active: EditCartItem = {
          lineId: this.productItem.lineItemId,
          quantity: this.productItem.quantity + 1,
        };
        cart = await getCartModel().editProductCount(active);
        updateItem = cart.products.find((item) => item.lineItemId === this.productItem.lineItemId);
        break;
      }

      default:
        break;
    }

    if (updateItem) {
      this.productItem = updateItem;
      this.view.updateInfo(this.productItem);
    } else {
      this.getHTML().remove();
    }

    if (cart) {
      this.callback(cart);
    }
  }
}

export default ProductOrderModel;
