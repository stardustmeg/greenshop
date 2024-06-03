import type ProductFiltersParams from '@/shared/types/productFilters.ts';

import ProductFiltersView from '../view/ProductFiltersView.ts';

class ProductFiltersModel {
  private view: ProductFiltersView;

  constructor(params: ProductFiltersParams | null, callback: () => void) {
    this.view = new ProductFiltersView(params, callback);
  }

  public getView(): ProductFiltersView {
    return this.view;
  }
}

export default ProductFiltersModel;
