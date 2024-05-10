import CatalogView from '../view/CatalogView.ts';

class CatalogModel {
  private view = new CatalogView();

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default CatalogModel;
