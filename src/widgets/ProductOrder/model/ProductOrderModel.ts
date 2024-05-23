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

  public deleteClickHandler = async (): Promise<void> => {
    const cart = await getCartModel().deleteProductFromCart(this.productItem);
    const updateItem = cart.products.find((item) => item.lineItemId === this.productItem.lineItemId);
    if (updateItem) {
      this.productItem = updateItem;
      this.view.updateQuantity(this.productItem.quantity);
    } else {
      this.getHTML().remove();
    }
  };

  public minusClickHandler = async (): Promise<void> => {
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
  };

  public plusClickHandler = async (): Promise<void> => {
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
  };

  constructor(productItem: CartProduct) {
    this.productItem = productItem;
    const callbackList: CallbackList = {
      delete: this.deleteClickHandler,
      minus: this.minusClickHandler,
      plus: this.plusClickHandler,
    };
    this.view = new ProductOrderView(this.productItem, callbackList);
    this.init();
  }

  private init(): void {}

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }

  public getProduct(): CartProduct {
    return this.productItem;
  }
}

export default ProductOrderModel;
