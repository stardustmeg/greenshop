import type ProductFiltersParams from '@/shared/types/productFilters.ts';

import ProductCardModel from '@/entities/ProductCard/model/ProductCardModel.ts';
import ProductFiltersModel from '@/features/ProductFilters/model/ProductFiltersModel.ts';
import getProductModel from '@/shared/API/product/model/ProductModel.ts';
import FilterProduct from '@/shared/API/product/utils/filter.ts';
import { FilterFields, type OptionsRequest } from '@/shared/API/types/type.ts';
import LoaderModel from '@/shared/Loader/model/LoaderModel.ts';
import getStore from '@/shared/Store/Store.ts';
import observeStore, {
  observeSetInStore,
  selectSelectedFiltersCategory,
  selectSelectedFiltersMetaFilter,
  selectSelectedFiltersPrice,
  selectSelectedFiltersSize,
} from '@/shared/Store/observer.ts';
import { META_FILTERS } from '@/shared/constants/filters.ts';
import { LOADER_SIZE } from '@/shared/constants/sizes.ts';
import showBadRequestMessage from '@/shared/utils/showBadRequestMessage.ts';

import CatalogView from '../view/CatalogView.ts';

class CatalogModel {
  private productFilters: ProductFiltersModel | null = null;

  private view = new CatalogView();

  constructor() {
    this.init();
  }

  private addCurrentMetaFilter(filter: FilterProduct, metaFilter: string): FilterProduct {
    switch (metaFilter) {
      case META_FILTERS.ru.ALL_PRODUCTS:
        return filter;
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

  private async getProductItems(options: OptionsRequest): Promise<ProductFiltersParams | null> {
    const productList = this.view.getItemsList();
    const loader = new LoaderModel(LOADER_SIZE.EXTRA_LARGE);
    loader.setAbsolutePosition();
    productList.append(loader.getHTML());

    try {
      const { categoryCount, products, sizeCount } = await getProductModel().getProducts(options);
      const priceRange = await getProductModel().getPriceRange();
      return { categoriesProductCount: categoryCount, priceRange, products, sizes: sizeCount };
    } catch {
      showBadRequestMessage();
    } finally {
      loader.getHTML().remove();
    }
    return null;
  }

  private getSelectedFilters(): OptionsRequest {
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

    return { filter: filter.getFilter(), sort: { direction: 'asc', field: 'name', locale: 'en' } };
  }

  private init(): void {
    const productList = this.view.getItemsList();
    // TBD: create method to collect filters from the url
    this.getProductItems({})
      .then((data) => {
        if (data?.products?.length) {
          data.products.forEach((productData) => productList.append(new ProductCardModel(productData, null).getHTML()));
        }
        this.view.switchEmptyList(!data?.products?.length);
        this.productFilters = new ProductFiltersModel(data);
        this.view.getLeftWrapper().append(this.productFilters.getDefaultFilters());
        this.view.getRightWrapper().append(this.productFilters.getMetaFilters());
      })
      .catch(() => showBadRequestMessage());

    observeSetInStore(selectSelectedFiltersCategory, () => this.redrawProductList(this.getSelectedFilters()));
    observeStore(selectSelectedFiltersPrice, () => this.redrawProductList(this.getSelectedFilters()));
    observeStore(selectSelectedFiltersSize, () => this.redrawProductList(this.getSelectedFilters()));
    observeStore(selectSelectedFiltersMetaFilter, () => this.redrawProductList(this.getSelectedFilters()));
  }

  private redrawProductList(options?: OptionsRequest): void {
    const currentSize = getStore().getState().selectedFilters?.size ?? null;
    const productList = this.view.getItemsList();
    productList.innerHTML = '';
    this.getProductItems(options ?? {})
      .then((data) => {
        if (data?.products?.length) {
          data?.products?.forEach((productData) =>
            productList.append(new ProductCardModel(productData, currentSize).getHTML()),
          );
        }
        this.view.switchEmptyList(!data?.products?.length);
        this.productFilters?.updateParams(data);
      })
      .catch(() => showBadRequestMessage());
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default CatalogModel;
