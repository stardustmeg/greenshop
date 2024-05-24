import type { Variant } from '@/shared/types/product.ts';

import ProductPriceView from '../view/ProductPriceView.ts';

class ProductPriceModel {
  private view: ProductPriceView;

  constructor(currentVariant: Variant) {
    this.view = new ProductPriceView(currentVariant);
    this.init();
  }

  private init(): void {}

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default ProductPriceModel;
