import type { CartProduct, EditCartItem } from '@/shared/types/cart.ts';

import getCartModel from '@/shared/API/cart/model/CartModel.ts';

import ProductOrderView from '../view/ProductOrderView.ts';

type CallbackQuantity = () => Promise<void>;

export type CallbackList = {
  delete: CallbackQuantity;
  minus: CallbackQuantity;
  plus: CallbackQuantity;
};

class ProductOrderModel {
  private productItem: CartProduct;

  private view: ProductOrderView;

  constructor(productItem: CartProduct) {
    this.productItem = productItem;
    const callbackList: CallbackList = {
      delete: this.deleteClickHandler.bind(this),
      minus: this.minusClickHandler.bind(this),
      plus: this.plusClickHandler.bind(this),
    };
    this.view = new ProductOrderView(this.productItem, callbackList);
    this.init();
  }

  private init(): void {}

  public async deleteClickHandler(): Promise<void> {
    const cart = await getCartModel().deleteProductFromCart(this.productItem);
    const updateItem = cart.products.find((item) => item.lineItemId === this.productItem.lineItemId);
    if (updateItem) {
      this.productItem = updateItem;
      this.view.updateQuantity(this.productItem.quantity);
    } else {
      this.getHTML().remove();
    }
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }

  public getProduct(): CartProduct {
    return this.productItem;
  }

  public async minusClickHandler(): Promise<void> {
    const active: EditCartItem = {
      lineId: this.productItem.lineItemId,
      quantity: this.productItem.quantity - 1,
    };
    const cart = await getCartModel().editProductCount(active);
    const updateItem = cart.products.find((item) => item.lineItemId === this.productItem.lineItemId);
    if (updateItem) {
      this.productItem = updateItem;
      this.view.updateQuantity(this.productItem.quantity);
    } else {
      this.getHTML().remove();
    }
  }

  public async plusClickHandler(): Promise<void> {
    const active: EditCartItem = {
      lineId: this.productItem.lineItemId,
      quantity: this.productItem.quantity + 1,
    };
    const cart = await getCartModel().editProductCount(active);
    const updateItem = cart.products.find((item) => item.lineItemId === this.productItem.lineItemId);
    if (updateItem) {
      this.productItem = updateItem;
      this.view.updateQuantity(this.productItem.quantity);
    }
  }
}

export default ProductOrderModel;
