import type ProductCardParams from '@/shared/types/productCard';

import ProductCardView from '../view/ProductCardView.ts';

class ProductCardModel {
  private view: ProductCardView;

  constructor(params: ProductCardParams, size: null | string) {
    this.view = new ProductCardView(params, size);
  }

  public getHTML(): HTMLLIElement {
    return this.view.getHTML();
  }
}

export default ProductCardModel;