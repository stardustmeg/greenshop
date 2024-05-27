import ProductSortsView from '../view/ProductSortsView.ts';

class ProductSortsModel {
  private view: ProductSortsView;

  constructor(callback: () => void) {
    this.view = new ProductSortsView(callback);
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default ProductSortsModel;
