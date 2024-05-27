import PaginationView from '../view/PaginationView.ts';

class PaginationModel {
  private view: PaginationView;

  constructor(
    productInfo: { productTotalCount: number; productsPerPageCount: number },
    callback: (page: string) => void,
  ) {
    this.view = new PaginationView(productInfo, callback);
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }

  public getView(): PaginationView {
    return this.view;
  }
}

export default PaginationModel;
