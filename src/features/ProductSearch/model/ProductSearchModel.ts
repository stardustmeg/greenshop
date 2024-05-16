import ProductSearchView from '../view/ProductSearchView.ts';

class ProductSearchModel {
  private view = new ProductSearchView();

  constructor() {
    this.init();
  }

  private init(): void {}

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default ProductSearchModel;
