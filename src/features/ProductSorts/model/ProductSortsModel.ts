import type { SelectedSorting } from '@/shared/types/productSorting.ts';

import getStore from '@/shared/Store/Store.ts';
import { setSelectedSorting } from '@/shared/Store/actions.ts';
import { DATA_KEYS } from '@/shared/constants/common.ts';

import ProductSortsView from '../view/ProductSortsView.ts';

class ProductSortsModel {
  private selectedSorting: SelectedSorting = {
    direction: 'asc',
    field: 'price',
  };

  private view = new ProductSortsView();

  constructor() {
    this.init();
  }

  private init(): void {
    getStore().dispatch(setSelectedSorting(this.selectedSorting));
    this.setSortingLinksHandlers();
  }

  private setSortingLinksHandlers(): void {
    const sortingLinks = this.view.getSortingLinks();
    sortingLinks.forEach((link) => {
      link.getHTML().addEventListener('click', () => {
        this.selectedSorting.field = link.getHTML().id;
        this.selectedSorting.direction = String(link.getHTML().getAttribute(DATA_KEYS.DIRECTION));
        getStore().dispatch(setSelectedSorting(this.selectedSorting));
        const url = new URL(decodeURIComponent(window.location.href));
        url.searchParams.delete('field');
        url.searchParams.set('field', this.selectedSorting.field);
        url.searchParams.delete('direction');
        url.searchParams.set('direction', this.selectedSorting.direction);
        const path = url.pathname + encodeURIComponent(url.search);
        window.history.pushState({ path }, '', path);
      });
    });
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default ProductSortsModel;
