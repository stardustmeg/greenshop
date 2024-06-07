import ProductPriceView from '../view/ProductPriceView.ts';

class ProductPriceModel {
  private view: ProductPriceView;

  constructor(params: { new: number; old: number }) {
    this.view = new ProductPriceView(params);
    this.init();
  }

  private init(): void {}

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default ProductPriceModel;
