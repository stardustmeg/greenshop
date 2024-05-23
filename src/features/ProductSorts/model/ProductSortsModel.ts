import type { SelectedSorting } from '@/shared/types/productSorting.ts';

import RouterModel from '@/app/Router/model/RouterModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { DATA_KEYS } from '@/shared/constants/common.ts';
import { SEARCH_PARAMS_FIELD } from '@/shared/constants/product.ts';

import ProductSortsView from '../view/ProductSortsView.ts';

class ProductSortsModel {
  private selectedSorting: SelectedSorting = {
    direction: '',
    field: '',
  };

  private view = new ProductSortsView();

  constructor() {
    this.init();
  }

  private init(): void {
    this.selectedSorting = getStore().getState().selectedSorting ?? this.selectedSorting;
    this.setSortingLinksHandlers();
  }

  private setSortingLinksHandlers(): void {
    const sortingLinks = this.view.getSortingLinks();
    sortingLinks.forEach((link) => {
      link.getHTML().addEventListener('click', () => {
        this.selectedSorting.field = link.getHTML().id;
        this.selectedSorting.direction = String(link.getHTML().getAttribute(DATA_KEYS.DIRECTION));
        const url = new URL(decodeURIComponent(window.location.href));
        url.searchParams.delete(SEARCH_PARAMS_FIELD.FIELD);
        url.searchParams.set(SEARCH_PARAMS_FIELD.FIELD, this.selectedSorting.field);
        url.searchParams.delete(SEARCH_PARAMS_FIELD.DIRECTION);
        url.searchParams.set(SEARCH_PARAMS_FIELD.DIRECTION, this.selectedSorting.direction);
        const path = url.pathname + encodeURIComponent(url.search);
        RouterModel.getInstance().navigateTo(path.slice(1));
      });
    });
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default ProductSortsModel;
