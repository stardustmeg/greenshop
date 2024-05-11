import type LinkModel from '@/shared/Link/model/LinkModel.ts';
import type ProductFiltersParams from '@/shared/types/productFilters.ts';
import type { SelectedFilters } from '@/shared/types/productFilters.ts';

import getStore from '@/shared/Store/Store.ts';
import { setSelectedFilters } from '@/shared/Store/actions.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';

import ProductFiltersView from '../view/ProductFiltersView.ts';

class ProductFiltersModel {
  private selectedFilters: SelectedFilters = {
    category: new Set(),
  };

  private view: ProductFiltersView;

  constructor(params: ProductFiltersParams) {
    this.view = new ProductFiltersView(params);
    this.init();
  }

  private init(): void {
    this.initCategoryFilters();

    observeStore(selectCurrentLanguage, () => {
      this.initCategoryFilters();
    });
  }

  private initCategoryFilters(): void {
    this.setCategoryLinksHandlers();
    this.selectedFilters = getStore().getState().selectedFilters ?? this.selectedFilters;
    const categoryLinks = this.view.getCategoryLinks();
    this.selectedFilters.category.forEach((categoryID) => {
      const currentLink = categoryLinks.find((link) => link.getHTML().id === categoryID);
      if (currentLink) {
        this.view.switchSelectCategory(currentLink);
      }
    });
  }

  private setCategoryLinksHandlers(): void {
    this.view.getCategoryLinks().forEach((categoryLink) => {
      categoryLink.getHTML().addEventListener('click', () => {
        this.view.switchSelectCategory(categoryLink);
        const categoryID = categoryLink.getHTML().id;
        if (this.selectedFilters.category.has(categoryID)) {
          this.selectedFilters.category.delete(categoryID);
        } else {
          this.selectedFilters.category.add(categoryID);
        }

        getStore().dispatch(setSelectedFilters(this.selectedFilters));
      });
    });
  }

  public getCategoryLinks(): LinkModel[] {
    return this.view.getCategoryLinks();
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }

  public updateParams(params: ProductFiltersParams): void {
    this.view.updateParams(params);
  }
}

export default ProductFiltersModel;
