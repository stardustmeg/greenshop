import type LinkModel from '@/shared/Link/model/LinkModel.ts';
import type ProductFiltersParams from '@/shared/types/productFilters.ts';
import type { SelectedFilters } from '@/shared/types/productFilters.ts';

import getStore from '@/shared/Store/Store.ts';
import { setSelectedFilters } from '@/shared/Store/actions.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import { FILTER_INPUT_RANGE_LABEL } from '@/shared/constants/filters.ts';

import ProductFiltersView from '../view/ProductFiltersView.ts';

class ProductFiltersModel {
  private params: ProductFiltersParams;

  private selectedFilters: SelectedFilters = {
    category: new Set(),
    price: {
      max: 0,
      min: 0,
    },
    size: null,
  };

  private view: ProductFiltersView;

  constructor(params: ProductFiltersParams) {
    this.params = params;
    this.view = new ProductFiltersView(params);
    this.init();
  }

  private init(): void {
    this.selectedFilters = getStore().getState().selectedFilters ?? this.selectedFilters;
    this.initCategoryFilters();
    this.initPriceFilters();
    this.initSizeFilters();
    this.setResetFiltersButtonHandler();

    observeStore(selectCurrentLanguage, () => {
      this.selectedFilters = getStore().getState().selectedFilters ?? this.selectedFilters;
      this.initSizeFilters();
      this.initCategoryFilters();
    });
  }

  private initCategoryFilters(): void {
    this.setCategoryLinksHandlers();
    const categoryLinks = this.view.getCategoryLinks();
    this.selectedFilters.category.forEach((categoryID) => {
      const currentLink = categoryLinks.find((link) => link.getHTML().id === categoryID);
      if (currentLink) {
        this.view.switchSelectedFilter(currentLink, true);
      }
    });
  }

  private initPriceFilters(): void {
    const fromInput = this.view
      .getPriceInputs()
      .get(FILTER_INPUT_RANGE_LABEL[getStore().getState().currentLanguage].FROM);
    const toInput = this.view.getPriceInputs().get(FILTER_INPUT_RANGE_LABEL[getStore().getState().currentLanguage].TO);
    const priceSlider = this.view.getPriceSlider();
    if (!fromInput || !toInput) {
      return;
    }
    priceSlider.on('update', (values) => {
      const [min, max] = values;
      fromInput.getHTML().value = min.toString();
      toInput.getHTML().value = max.toString();
    });

    priceSlider.on('set', (values) => {
      const [min, max] = values;
      this.selectedFilters.price = {
        max: +max,
        min: +min,
      };

      getStore().dispatch(setSelectedFilters(this.selectedFilters));
    });

    fromInput
      .getHTML()
      .addEventListener('change', () => priceSlider.set([fromInput.getHTML().value, toInput.getHTML().value]));
    toInput
      .getHTML()
      .addEventListener('change', () => priceSlider.set([fromInput.getHTML().value, toInput.getHTML().value]));
  }

  private initSizeFilters(): void {
    this.setSizeLinksHandlers();
    const sizeLinks = this.view.getSizeLinks();
    const currentLink = sizeLinks.find((link) => link.getHTML().id === this.selectedFilters.size);
    if (currentLink) {
      this.view.switchSelectedFilter(currentLink, true);
    }
  }

  private setCategoryLinksHandlers(): void {
    this.view.getCategoryLinks().forEach((categoryLink) => {
      categoryLink.getHTML().addEventListener('click', () => {
        this.view.switchSelectedFilter(categoryLink);
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

  private setResetFiltersButtonHandler(): void {
    const filtersResetButton = this.view.getFiltersResetButton();
    filtersResetButton.getHTML().addEventListener('click', () => {
      this.view.getCategoryLinks().forEach((link) => this.view.switchSelectedFilter(link, false));
      this.view.getSizeLinks().forEach((link) => this.view.switchSelectedFilter(link, false));
      this.selectedFilters = {
        category: new Set(),
        price: {
          max: this.params.priceRange?.max ?? 0,
          min: this.params.priceRange?.min ?? 0,
        },
        size: null,
      };

      this.view.getPriceSlider().set([this.params.priceRange?.min ?? 0, this.params.priceRange?.max ?? 0]);

      getStore().dispatch(setSelectedFilters(this.selectedFilters));
    });
  }

  private setSizeLinksHandlers(): void {
    this.view.getSizeLinks().forEach((sizeLink) => {
      sizeLink.getHTML().addEventListener('click', () => {
        this.view.getSizeLinks().forEach((link) => this.view.switchSelectedFilter(link, false));
        this.view.switchSelectedFilter(sizeLink, true);
        const sizeID = sizeLink.getHTML().id;
        this.selectedFilters.size = sizeID;

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
