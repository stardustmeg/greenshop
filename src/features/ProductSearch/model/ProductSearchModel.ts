import { remove, set } from '@/app/Router/helpers/helpers.ts';
import RouterModel from '@/app/Router/model/RouterModel.ts';
import EventMediatorModel from '@/shared/EventMediator/model/EventMediatorModel.ts';
import MEDIATOR_EVENT from '@/shared/constants/events.ts';
import { SEARCH_PARAMS_FIELD } from '@/shared/constants/product.ts';
import debounce from '@/shared/utils/debounce.ts';

import ProductSearchView from '../view/ProductSearchView.ts';

const SEARCH_DELAY = 300;

class ProductSearchModel {
  private callback: () => void;

  private view = new ProductSearchView();

  constructor(callback: () => void) {
    this.callback = callback;
    this.init();
  }

  private handleSearchInput(): void {
    RouterModel.changeSearchParams((url) => {
      remove(url, SEARCH_PARAMS_FIELD.PAGE);
      set(url, SEARCH_PARAMS_FIELD.SEARCH, this.view.getSearchField().getValue());
    });
    this.callback();
  }

  private init(): void {
    EventMediatorModel.getInstance().subscribe(MEDIATOR_EVENT.CLEAR_CATALOG_SEARCH, () =>
      this.view.getSearchField().setValue(''),
    );
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
