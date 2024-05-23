import type LinkModel from '@/shared/Link/model/LinkModel.ts';
import type ProductFiltersParams from '@/shared/types/productFilters.ts';
import type { SelectedFilters } from '@/shared/types/productFilters.ts';

import RouterModel from '@/app/Router/model/RouterModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { setSelectedFilters } from '@/shared/Store/actions.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import { META_FILTERS } from '@/shared/constants/filters.ts';
import { SEARCH_PARAMS_FIELD } from '@/shared/constants/product.ts';

import ProductFiltersView from '../view/ProductFiltersView.ts';

const DEFAULT_SEGMENT = import.meta.env.VITE_APP_DEFAULT_SEGMENT;
const NEXT_SEGMENT = import.meta.env.VITE_APP_NEXT_SEGMENT;

class ProductFiltersModel {
  private selectedFilters: SelectedFilters = {
    category: new Set(),
    metaFilter: META_FILTERS.en.ALL_PRODUCTS,
    price: {
      max: 0,
      min: 0,
    },
    size: null,
  };

  private view: ProductFiltersView;

  constructor(params: ProductFiltersParams | null) {
    this.view = new ProductFiltersView(params);
    this.init();
  }

  private init(): void {
    this.selectedFilters = getStore().getState().selectedFilters ?? this.selectedFilters;
    this.initCategoryFilters();
    this.initPriceFilters();
    this.initSizeFilters();
    this.setMetaLinksHandlers();
    this.setResetFiltersButtonHandler();

    observeStore(selectCurrentLanguage, () => {
      this.selectedFilters = getStore().getState().selectedFilters ?? this.selectedFilters;
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
    this.view.getPriceSlider().on('set', (values) => {
      const [min, max] = values;
      this.selectedFilters.price = {
        max: +max,
        min: +min,
      };
      const url = new URL(decodeURIComponent(window.location.href));
      url.searchParams.delete(SEARCH_PARAMS_FIELD.MIN_PRICE);
      url.searchParams.set(SEARCH_PARAMS_FIELD.MIN_PRICE, String(this.selectedFilters.price.min));
      url.searchParams.delete(SEARCH_PARAMS_FIELD.MAX_PRICE);
      url.searchParams.set(SEARCH_PARAMS_FIELD.MAX_PRICE, String(this.selectedFilters.price.max));
      const path = url.pathname + encodeURIComponent(url.search);
      RouterModel.getInstance().navigateTo(path.slice(1));
    });
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
      });
    });
  }

  private setMetaLinksHandlers(): void {
    const activeMetaLink = this.view
      .getMetaLinks()
      .find((link) => link.getHTML().id === this.selectedFilters.metaFilter);
    if (activeMetaLink) {
      this.switchLinkState(activeMetaLink);
    }
    this.view.getMetaLinks().forEach((metaLink) => {
      metaLink.getHTML().addEventListener('click', () => {
        this.switchLinkState(metaLink);
        this.selectedFilters.metaFilter = metaLink.getHTML().id;
        getStore().dispatch(setSelectedFilters(this.selectedFilters));
      });
    });
  }

  private setResetFiltersButtonHandler(): void {
    const filtersResetButton = this.view.getFiltersResetButton();
    filtersResetButton.getHTML().addEventListener('click', () => {
      const url = new URL(decodeURIComponent(window.location.href));
      const path = `${DEFAULT_SEGMENT}${url.pathname.split(DEFAULT_SEGMENT)[NEXT_SEGMENT]}${DEFAULT_SEGMENT}`;
      RouterModel.getInstance().navigateTo(path.slice(1));
    });
  }

  private setSizeLinksHandlers(): void {
    this.view.getSizeLinks().forEach((sizeLink) => {
      sizeLink.getHTML().addEventListener('click', () => {
        this.view.getSizeLinks().forEach((link) => this.view.switchSelectedFilter(link, false));
        this.view.switchSelectedFilter(sizeLink, true);
      });
    });
  }

  private switchLinkState(metaLink: LinkModel): void {
    this.view.getMetaLinks().forEach((link) => {
      this.view.switchSelectedFilter(link, false);
    });
    this.view.switchSelectedFilter(metaLink, true);
  }

  public getDefaultFilters(): HTMLDivElement {
    return this.view.getDefaultFilters();
  }

  public getMetaFilters(): HTMLDivElement {
    return this.view.getMetaFilters();
  }

  public updateParams(params: ProductFiltersParams | null): void {
    this.view.updateParams(params);
  }
}

export default ProductFiltersModel;
