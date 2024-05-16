import getStore from '@/shared/Store/Store.ts';
import { setSearchValue } from '@/shared/Store/actions.ts';
import debounce from '@/shared/utils/debounce.ts';

import ProductSearchView from '../view/ProductSearchView.ts';

const SEARCH_DELAY = 800;

class ProductSearchModel {
  private view = new ProductSearchView();

  constructor() {
    this.init();
  }

  private handleSearchInput(): void {
    getStore().dispatch(setSearchValue(this.view.getSearchField().getValue()));
  }

  private init(): void {
    this.setSearchFieldHandler();
  }

  private setSearchFieldHandler(): void {
    const searchField = this.view.getSearchField();
    searchField.getHTML().addEventListener('input', debounce(this.handleSearchInput.bind(this), SEARCH_DELAY));
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default ProductSearchModel;