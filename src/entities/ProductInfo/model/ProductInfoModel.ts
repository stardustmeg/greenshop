import type { ProductInfoParams } from '@/shared/types/product.ts';

import ProductInfoView from '../view/ProductInfoView.ts';

class ProductInfoModel {
  private view: ProductInfoView;

  constructor(params: ProductInfoParams) {
    this.view = new ProductInfoView(params);
    this.init();
  }

  private init(): void {}

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default ProductInfoModel;
