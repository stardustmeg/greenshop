import type LinkModel from '@/shared/Link/model/LinkModel.ts';
import type ProductFiltersParams from '@/shared/types/productFilters.ts';
import type { SelectedFilters } from '@/shared/types/productFilters.ts';

import EventMediatorModel from '@/shared/EventMediator/model/EventMediatorModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { setSelectedFilters } from '@/shared/Store/actions.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import MEDIATOR_EVENT from '@/shared/constants/events.ts';
import { META_FILTERS } from '@/shared/constants/filters.ts';
import { SEARCH_PARAMS_FIELD } from '@/shared/constants/product.ts';

import ProductFiltersView from '../view/ProductFiltersView.ts';

const DEFAULT_SEGMENT = import.meta.env.VITE_APP_DEFAULT_SEGMENT;
const NEXT_SEGMENT = import.meta.env.VITE_APP_NEXT_SEGMENT;

class ProductFiltersModel {
  private eventMediator = EventMediatorModel.getInstance();

  private params: ProductFiltersParams | null;

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
    this.params = params;
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
      getStore().dispatch(setSelectedFilters(this.selectedFilters));
      this.eventMediator.notify(MEDIATOR_EVENT.REDRAW_PRODUCTS, this.selectedFilters);

      const url = new URL(decodeURIComponent(window.location.href));
      url.searchParams.delete(SEARCH_PARAMS_FIELD.MIN_PRICE);
      url.searchParams.set(SEARCH_PARAMS_FIELD.MIN_PRICE, String(this.selectedFilters.price.min));
      url.searchParams.delete(SEARCH_PARAMS_FIELD.MAX_PRICE);
      url.searchParams.set(SEARCH_PARAMS_FIELD.MAX_PRICE, String(this.selectedFilters.price.max));
      const path = url.pathname + encodeURIComponent(url.search);
      window.history.pushState({ path }, '', path);
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
        const categoryID = categoryLink.getHTML().id;

        if (this.selectedFilters.category.has(categoryID)) {
          this.selectedFilters.category.delete(categoryID);
        } else {
          this.selectedFilters.category.add(categoryID);
        }

        getStore().dispatch(setSelectedFilters(this.selectedFilters));
        this.eventMediator.notify(MEDIATOR_EVENT.REDRAW_PRODUCTS, this.selectedFilters);
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
        this.eventMediator.notify(MEDIATOR_EVENT.REDRAW_PRODUCTS, this.selectedFilters);
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
        metaFilter: META_FILTERS.en.ALL_PRODUCTS,
        price: {
          max: this.params?.priceRange?.max ?? 0,
          min: this.params?.priceRange?.min ?? 0,
        },
        size: null,
      };
      this.view.getMetaLinks().forEach((link) => {
        this.view.switchSelectedFilter(link, false);
        if (link.getHTML().id === this.selectedFilters.metaFilter) {
          this.view.switchSelectedFilter(link, true);
        }
      });

      this.view.getPriceSlider().set([this.params?.priceRange?.min ?? 0, this.params?.priceRange?.max ?? 0]);
      getStore().dispatch(setSelectedFilters(this.selectedFilters));
      this.eventMediator.notify(MEDIATOR_EVENT.REDRAW_PRODUCTS, this.selectedFilters);
      const url = new URL(decodeURIComponent(window.location.href));
      const path = `${DEFAULT_SEGMENT}${url.pathname.split(DEFAULT_SEGMENT)[NEXT_SEGMENT]}${DEFAULT_SEGMENT}`;
      window.history.pushState({ path }, '', path);
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
        this.eventMediator.notify(MEDIATOR_EVENT.REDRAW_PRODUCTS, this.selectedFilters);
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
