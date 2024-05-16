import type ProductFiltersParams from '@/shared/types/productFilters.ts';

import ProductCardModel from '@/entities/ProductCard/model/ProductCardModel.ts';
import ProductFiltersModel from '@/features/ProductFilters/model/ProductFiltersModel.ts';
import ProductSearchModel from '@/features/ProductSearch/model/ProductSearchModel.ts';
import ProductSortsModel from '@/features/ProductSorts/model/ProductSortsModel.ts';
import getProductModel from '@/shared/API/product/model/ProductModel.ts';
import FilterProduct from '@/shared/API/product/utils/filter.ts';
import { type OptionsRequest, SortDirection, SortFields, type SortOptions } from '@/shared/API/types/type.ts';
import { FilterFields } from '@/shared/API/types/type.ts';
import LoaderModel from '@/shared/Loader/model/LoaderModel.ts';
import getStore from '@/shared/Store/Store.ts';
import observeStore, {
  observeSetInStore,
  selectSelectedFiltersCategory,
  selectSelectedFiltersMetaFilter,
  selectSelectedFiltersPrice,
  selectSelectedFiltersSize,
  selectSelectedSortingDirection,
  selectSelectedSortingField,
} from '@/shared/Store/observer.ts';
import { META_FILTERS } from '@/shared/constants/filters.ts';
import { LOADER_SIZE } from '@/shared/constants/sizes.ts';
import { SORTING_ID } from '@/shared/constants/sorting.ts';
import showErrorMessage from '@/shared/utils/userMessage.ts';

import CatalogView from '../view/CatalogView.ts';

class CatalogModel {
  private productFilters: ProductFiltersModel | null = null;

  private productSearch: ProductSearchModel | null = null;

  private productSorting: ProductSortsModel | null = null;

  private view = new CatalogView();

  constructor() {
    this.init();
  }

  private addCurrentMetaFilter(filter: FilterProduct, metaFilter: string): FilterProduct {
    switch (metaFilter) {
      case META_FILTERS.en.NEW_ARRIVALS:
        filter.addFilter(FilterFields.NEW_ARRIVAL);
        return filter;
      case META_FILTERS.en.SALE:
        filter.addFilter(FilterFields.SALE);
        return filter;
      default:
        return filter;
    }
  }

  private getOptions(): OptionsRequest {
    const { category, metaFilter, price, size } = getStore().getState().selectedFilters || {};
    const filter = new FilterProduct();
    category?.forEach((categoryID) => filter.addFilter(FilterFields.CATEGORY, categoryID));
    if (price?.max || price?.min) {
      filter.addFilter(FilterFields.PRICE, price);
    }
    if (size) {
      filter.addFilter(FilterFields.SIZE, size);
    }

    this.addCurrentMetaFilter(filter, metaFilter ?? META_FILTERS.en.ALL_PRODUCTS);
    const currentSort = this.getSelectedSorting();
    if (currentSort) {
      return { filter: filter.getFilter(), sort: currentSort };
    }

    return { filter: filter.getFilter() };
  }

  private async getProductItems(options: OptionsRequest): Promise<ProductFiltersParams | null> {
    const productList = this.view.getItemsList();
    const loader = new LoaderModel(LOADER_SIZE.EXTRA_LARGE);
    loader.setAbsolutePosition();
    productList.append(loader.getHTML());

    try {
      const { categoryCount, priceRange, products, sizeCount } = await getProductModel().getProducts(options);
      return { categoriesProductCount: categoryCount, priceRange, products, sizes: sizeCount };
    } catch {
      showErrorMessage();
    } finally {
      loader.getHTML().remove();
    }
    return null;
  }

  private getSelectedSorting(): SortOptions | null {
    const { direction, field } = getStore().getState().selectedSorting || {};
    const currentDirection = direction === SortDirection.ASC ? SortDirection.ASC : SortDirection.DESC;
    const currentField = field === SortFields.NAME ? SortFields.NAME : SortFields.PRICE;

    if (field === SortFields.PRICE) {
      return { direction: currentDirection, field: currentField };
    }
    if (field === SORTING_ID.DEFAULT) {
      return null;
    }
    return { direction: currentDirection, field: currentField, locale: getStore().getState().currentLanguage };
  }

  private init(): void {
    const productList = this.view.getItemsList();
    getProductModel()
      .getCategories()
      .then(() => {
        // TBD(SPRINT-5): create method to collect filters from the url
        this.getProductItems({})
          .then((data) => {
            if (data?.products?.length) {
              data.products.forEach((productData) =>
                productList.append(new ProductCardModel(productData, null).getHTML()),
              );
            }
            this.view.switchEmptyList(!data?.products?.length);
            this.productFilters = new ProductFiltersModel(data);
            this.productSorting = new ProductSortsModel();
            this.productSearch = new ProductSearchModel();
            this.view.getLeftWrapper().append(this.productFilters.getDefaultFilters());
            this.view
              .getRightTopWrapper()
              .append(
                this.productFilters.getMetaFilters(),
                this.productSorting.getHTML(),
                this.productSearch.getHTML(),
              );
          })
          .catch(() => showErrorMessage());
      })
      .catch(() => showErrorMessage());

    this.storeObservers();
  }

  private redrawProductList(options?: OptionsRequest): void {
    const currentSize = getStore().getState().selectedFilters?.size ?? null;
    const productList = this.view.getItemsList();
    productList.innerHTML = '';
    this.getProductItems(options ?? {})
      .then((data) => {
        productList.innerHTML = '';
        if (data?.products?.length) {
          data?.products?.forEach((productData) =>
            productList.append(new ProductCardModel(productData, currentSize).getHTML()),
          );
        }
        this.view.switchEmptyList(!data?.products?.length);
        this.productFilters?.updateParams(data);
      })
      .catch(() => showErrorMessage());
  }

  private storeObservers(): void {
    observeSetInStore(selectSelectedFiltersCategory, () => this.redrawProductList(this.getOptions()));
    observeStore(selectSelectedFiltersPrice, () => this.redrawProductList(this.getOptions()));
    observeStore(selectSelectedFiltersSize, () => this.redrawProductList(this.getOptions()));
    observeStore(selectSelectedFiltersMetaFilter, () => this.redrawProductList(this.getOptions()));
    observeStore(selectSelectedSortingField, () => this.redrawProductList(this.getOptions()));
    observeStore(selectSelectedSortingDirection, () => this.redrawProductList(this.getOptions()));
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default CatalogModel;
