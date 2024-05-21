import type { OptionsRequest, SortOptions } from '@/shared/API/types/type.ts';
import type ProductFiltersParams from '@/shared/types/productFilters.ts';

import ProductCardModel from '@/entities/ProductCard/model/ProductCardModel.ts';
import ProductFiltersModel from '@/features/ProductFilters/model/ProductFiltersModel.ts';
import ProductSearchModel from '@/features/ProductSearch/model/ProductSearchModel.ts';
import ProductSortsModel from '@/features/ProductSorts/model/ProductSortsModel.ts';
import getCartModel from '@/shared/API/cart/model/CartModel.ts';
import getProductModel from '@/shared/API/product/model/ProductModel.ts';
import FilterProduct from '@/shared/API/product/utils/filter.ts';
import getShoppingListModel from '@/shared/API/shopping-list/model/ShoppingListModel.ts';
import { FilterFields, SortDirection, SortFields } from '@/shared/API/types/type.ts';
import EventMediatorModel from '@/shared/EventMediator/model/EventMediatorModel.ts';
import LoaderModel from '@/shared/Loader/model/LoaderModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { setSelectedFilters, setSelectedSorting } from '@/shared/Store/actions.ts';
import MEDIATOR_EVENT from '@/shared/constants/events.ts';
import { META_FILTERS } from '@/shared/constants/filters.ts';
import { SEARCH_PARAMS_FIELD } from '@/shared/constants/product.ts';
import { LOADER_SIZE } from '@/shared/constants/sizes.ts';
import { SORTING_ID } from '@/shared/constants/sorting.ts';
import showErrorMessage from '@/shared/utils/userMessage.ts';

import CatalogView from '../view/CatalogView.ts';

class CatalogModel {
  private eventMediator = EventMediatorModel.getInstance();

  private productFilters: ProductFiltersModel | null = null;

  private productSearch: ProductSearchModel | null = null;

  private productSorting: ProductSortsModel | null = null;

  private view = new CatalogView();

  constructor(searchParams: string) {
    this.init(searchParams).catch(showErrorMessage);
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

  private decodeSearchParams(searchParams: string, productData: ProductFiltersParams): void {
    const params = new URLSearchParams(searchParams);
    const searchCategory = params.getAll(SEARCH_PARAMS_FIELD.CATEGORY);
    searchCategory.push(...params.getAll(SEARCH_PARAMS_FIELD.SUBCATEGORY));
    const categories = new Set(searchCategory);
    const searchMetaFilter = params.get(SEARCH_PARAMS_FIELD.META) ?? META_FILTERS.en.ALL_PRODUCTS;
    const searchSize = params.get(SEARCH_PARAMS_FIELD.SIZE) ?? null;
    const maxPrice = parseFloat(params.get(SEARCH_PARAMS_FIELD.MAX_PRICE) ?? '0');
    const minPrice = parseFloat(params.get(SEARCH_PARAMS_FIELD.MIN_PRICE) ?? '0');
    const searchPrice = {
      max: maxPrice !== 0 ? maxPrice : productData.priceRange?.max || 0,
      min: minPrice !== 0 ? minPrice : productData.priceRange?.min || 0,
    };

    const searchField = params.get(SEARCH_PARAMS_FIELD.FIELD);
    const searchDirection = params.get(SEARCH_PARAMS_FIELD.DIRECTION);

    getStore().dispatch(
      setSelectedFilters({ category: categories, metaFilter: searchMetaFilter, price: searchPrice, size: searchSize }),
    );

    if (searchField && searchDirection) {
      getStore().dispatch(setSelectedSorting({ direction: searchDirection, field: searchField }));
    }
  }

  private getOptions(): OptionsRequest {
    const { category, metaFilter, price, size } = getStore().getState().selectedFilters || {};
    const { currentLanguage, searchValue } = getStore().getState();
    const filter = new FilterProduct();
    category?.forEach((categoryID) => filter.addFilter(FilterFields.CATEGORY, categoryID));
    if (price && price.max > price.min) {
      filter.addFilter(FilterFields.PRICE, price);
    }
    if (size) {
      filter.addFilter(FilterFields.SIZE, size);
    }

    this.addCurrentMetaFilter(filter, metaFilter ?? META_FILTERS.en.ALL_PRODUCTS);
    const currentSort = this.getSelectedSorting();
    if (currentSort) {
      return { filter: filter.getFilter(), search: { locale: currentLanguage, value: searchValue }, sort: currentSort };
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

  private async init(searchParams: string): Promise<void> {
    const categories = await getProductModel().getCategories();
    if (categories) {
      const productData = await this.getProductItems({});
      if (productData && productData?.products?.length) {
        this.eventMediator.subscribe(MEDIATOR_EVENT.REDRAW_PRODUCTS, () => this.redrawProductList());
        this.decodeSearchParams(searchParams, productData);
        this.initSettingComponents(productData);
        this.redrawProductList().catch(showErrorMessage);
      }
      this.view.switchEmptyList(!productData?.products?.length);
      this.productFilters?.updateParams(productData);
    }
  }

  private initSettingComponents(data: ProductFiltersParams | null): void {
    this.productFilters = new ProductFiltersModel(data);
    this.productSorting = new ProductSortsModel();
    this.productSearch = new ProductSearchModel();
    this.view.getLeftWrapper().append(this.productFilters.getDefaultFilters());
    this.view
      .getRightTopWrapper()
      .append(this.productFilters.getMetaFilters(), this.productSorting.getHTML(), this.productSearch.getHTML());
  }

  private async redrawProductList(): Promise<void> {
    const currentSize = getStore().getState().selectedFilters?.size ?? null;
    const productList = this.view.getItemsList();
    productList.innerHTML = '';
    const productItems = await this.getProductItems(this.getOptions());
    if (productItems?.products?.length) {
      const shoppingList = await getShoppingListModel().getShoppingList();
      const cart = await getCartModel().getCart();
      productItems.products.forEach((productData) => {
        const product = new ProductCardModel(productData, currentSize, shoppingList, cart);
        productList.append(product.getHTML());
      });
    }
    this.productFilters?.updateParams(productItems);
    this.view.switchEmptyList(!productItems?.products?.length);
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default CatalogModel;
