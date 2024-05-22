import type { CartProduct } from '@/shared/types/cart.ts';

import ProductOrderView from '../view/ProductOrderView.ts';

class ProductOrderModel {
  private productItem: CartProduct;

  private view: ProductOrderView;

  constructor(productItem: CartProduct) {
    this.productItem = productItem;
    this.view = new ProductOrderView(this.productItem);
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
