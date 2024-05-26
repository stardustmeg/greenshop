import type { CartProduct, EditCartItem } from '@/shared/types/cart.ts';

import getCartModel from '@/shared/API/cart/model/CartModel.ts';
import { CartActive } from '@/shared/types/cart.ts';

import ProductOrderView from '../view/ProductOrderView.ts';

class ProductOrderModel {
  private productItem: CartProduct;

  private view: ProductOrderView;

  constructor(productItem: CartProduct) {
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
    switch (active) {
      case CartActive.DELETE: {
        const cart = await getCartModel().deleteProductFromCart(this.productItem);
        updateItem = cart.products.find((item) => item.lineItemId === this.productItem.lineItemId);
        break;
      }

      case CartActive.MINUS: {
        const active: EditCartItem = {
          lineId: this.productItem.lineItemId,
          quantity: this.productItem.quantity - 1,
        };
        const cart = await getCartModel().editProductCount(active);
        updateItem = cart.products.find((item) => item.lineItemId === this.productItem.lineItemId);
        break;
      }
      case CartActive.PLUS: {
        const active: EditCartItem = {
          lineId: this.productItem.lineItemId,
          quantity: this.productItem.quantity + 1,
        };
        const cart = await getCartModel().editProductCount(active);
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
  }
}

export default ProductOrderModel;
