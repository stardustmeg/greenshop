import type ProductFiltersParams from '@/shared/types/productFilters.ts';

import ProductCardModel from '@/entities/ProductCard/model/ProductCardModel.ts';
import ProductFiltersModel from '@/features/ProductFilters/model/ProductFiltersModel.ts';
import getProductModel from '@/shared/API/product/model/ProductModel.ts';
import addFilter from '@/shared/API/product/utils/filter.ts';
import { FilterFields, type OptionsRequest } from '@/shared/API/types/type.ts';
import LoaderModel from '@/shared/Loader/model/LoaderModel.ts';
import getStore from '@/shared/Store/Store.ts';
import observeStore, {
  observeSetInStore,
  selectSelectedFiltersCategory,
  selectSelectedFiltersPrice,
  selectSelectedFiltersSize,
} from '@/shared/Store/observer.ts';
import { LOADER_SIZE } from '@/shared/constants/sizes.ts';
import showBadRequestMessage from '@/shared/utils/showBadRequestMessage.ts';

import CatalogView from '../view/CatalogView.ts';

class CatalogModel {
  private productFilters: ProductFiltersModel | null = null;

  private view = new CatalogView();

  constructor() {
    this.init();
  }

  private async getProductItems(options: OptionsRequest): Promise<ProductFiltersParams | null> {
    const productList = this.view.getItemsList();
    const loader = new LoaderModel(LOADER_SIZE.EXTRA_LARGE);
    loader.setAbsolutePosition();
    productList.append(loader.getHTML());

    try {
      const categories = await getProductModel().getCategories();
      try {
        const products = await getProductModel().getProducts(options);
        const priceRange = await getProductModel().getPriceRange();
        const sizes = await getProductModel().getSizeProductCount();
        const categoriesProductCount = await getProductModel().getCategoriesProductCount();
        return { categories, categoriesProductCount, priceRange, products, sizes };
      } catch {
        showBadRequestMessage();
      }
    } catch {
      showBadRequestMessage();
    } finally {
      loader.getHTML().remove();
    }

    return null;
  }

  private getSelectedFilters(): OptionsRequest {
    const { category, price, size } = getStore().getState().selectedFilters || {};
    const filter: OptionsRequest['filter'] = [];
    category?.forEach((categoryID) => filter.push(addFilter(FilterFields.CATEGORY, categoryID)));
    if (price?.max || price?.min) {
      filter.push(addFilter(FilterFields.PRICE, price));
    }
    if (size) {
      filter.push(addFilter(FilterFields.SIZE, size));
    }

    return { filter, limit: 100, sort: { direction: 'desc', field: 'name', locale: 'en' } };
  }

  private init(): void {
    const productList = this.view.getItemsList();
    const { selectedFilters } = getStore().getState();
    this.getProductItems(this.getSelectedFilters())
      .then((data) => {
        if (!data?.products?.length) {
          productList.textContent = 'Ничего не найдено';
        } else {
          data.products.forEach((productData) =>
            productList.append(
              new ProductCardModel(productData, selectedFilters ? selectedFilters.size : null).getHTML(),
            ),
          );
        }
        this.productFilters = new ProductFiltersModel(
          data ?? { categories: null, categoriesProductCount: null, priceRange: null, products: null, sizes: null },
        );
        this.getHTML().append(this.productFilters.getHTML());
      })
      .catch(() => showBadRequestMessage());

    observeSetInStore(selectSelectedFiltersCategory, () => this.redrawProductList(this.getSelectedFilters()));
    observeStore(selectSelectedFiltersPrice, () => this.redrawProductList(this.getSelectedFilters()));
    observeStore(selectSelectedFiltersSize, () => this.redrawProductList(this.getSelectedFilters()));
  }

  private redrawProductList(options?: OptionsRequest): void {
    const productList = this.view.getItemsList();
    const { selectedFilters } = getStore().getState();
    productList.innerHTML = '';
    this.getProductItems(options ?? {})
      .then((data) => {
        if (data?.products?.length) {
          data?.products?.forEach((productData) =>
            productList.append(
              new ProductCardModel(productData, selectedFilters ? selectedFilters.size : null).getHTML(),
            ),
          );
          this.productFilters?.updateParams(data);
        } else {
          productList.textContent = 'Ничего не найдено';
        }
      })
      .catch(() => showBadRequestMessage());
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default CatalogModel;
