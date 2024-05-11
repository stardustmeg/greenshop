import type { Category, Product } from '@/shared/types/product.ts';

import ProductCardModel from '@/entities/ProductCard/model/ProductCardModel.ts';
import ProductFiltersModel from '@/features/ProductFilters/model/ProductFiltersModel.ts';
import getProductModel from '@/shared/API/product/model/ProductModel.ts';
import addFilter from '@/shared/API/product/utils/filter.ts';
import { FilterFields, type OptionsRequest } from '@/shared/API/types/type.ts';
import LoaderModel from '@/shared/Loader/model/LoaderModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { observeSetInStore, selectSelectedFilters } from '@/shared/Store/observer.ts';
import { LOADER_SIZE } from '@/shared/constants/sizes.ts';
import showBadRequestMessage from '@/shared/utils/showBadRequestMessage.ts';

import CatalogView from '../view/CatalogView.ts';

class CatalogModel {
  private productFilters: ProductFiltersModel | null = null;

  private view = new CatalogView();

  constructor() {
    this.init();
  }

  private async getProductItems(
    options: OptionsRequest,
  ): Promise<{ categories: Category[] | null; products: Product[] | null } | null> {
    const productList = this.view.getItemsList();
    const loader = new LoaderModel(LOADER_SIZE.EXTRA_LARGE);
    loader.setAbsolutePosition();
    productList.append(loader.getHTML());

    try {
      const categories = await getProductModel().getCategories();
      try {
        const products = await getProductModel().getProducts(options);
        return { categories, products };
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
    const filter: OptionsRequest['filter'] = [];
    getStore()
      .getState()
      .selectedFilters?.category.forEach((categoryID) => filter.push(addFilter(FilterFields.CATEGORY, categoryID)));
    return { filter, limit: 100, sort: { direction: 'desc', field: 'name', locale: 'en' } };
  }

  private init(): void {
    const productList = this.view.getItemsList();
    this.getProductItems(this.getSelectedFilters())
      .then((data) => {
        if (!data?.products?.length) {
          productList.textContent = 'Ничего не найдено';
        }
        data?.products?.forEach((productData) => productList.append(new ProductCardModel(productData, null).getHTML()));
        this.productFilters = new ProductFiltersModel({
          categories: data?.categories ?? [],
          products: data?.products ?? [],
        });
        this.getHTML().append(this.productFilters.getHTML());
      })
      .catch(() => {
        showBadRequestMessage();
      });

    observeSetInStore(selectSelectedFilters, () => {
      this.redrawProductList(this.getSelectedFilters());
    });
  }

  private redrawProductList(options?: OptionsRequest): void {
    const productList = this.view.getItemsList();
    productList.innerHTML = '';
    this.getProductItems(options ?? {})
      .then((data) => {
        if (data?.products?.length) {
          data?.products?.forEach((productData) =>
            productList.append(new ProductCardModel(productData, null).getHTML()),
          );
          this.productFilters?.updateParams({ categories: data?.categories ?? [], products: data?.products ?? [] });
        } else {
          productList.textContent = 'Ничего не найдено';
        }
      })
      .catch(() => {
        showBadRequestMessage();
      });
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default CatalogModel;
