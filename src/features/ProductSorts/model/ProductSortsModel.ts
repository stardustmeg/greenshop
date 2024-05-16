import type { SelectedSorting } from '@/shared/types/productSorting.ts';

import getStore from '@/shared/Store/Store.ts';
import { setSelectedSorting } from '@/shared/Store/actions.ts';

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
        this.selectedSorting.direction = String(link.getHTML().getAttribute('data-direction'));
        getStore().dispatch(setSelectedSorting(this.selectedSorting));
      });
    });
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default ProductSortsModel;
