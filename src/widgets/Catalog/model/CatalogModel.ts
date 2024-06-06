import type { OptionsRequest, SortOptions } from '@/shared/API/types/type.ts';
import type ProductFiltersParams from '@/shared/types/productFilters.ts';
import type { SelectedFilters } from '@/shared/types/productFilters.ts';
import type { SelectedSorting } from '@/shared/types/productSorting.ts';

import RouterModel from '@/app/Router/model/RouterModel.ts';
import ProductCardModel from '@/entities/ProductCard/model/ProductCardModel.ts';
import PaginationModel from '@/features/Pagination/model/PaginationModel.ts';
import ProductFiltersModel from '@/features/ProductFilters/model/ProductFiltersModel.ts';
import ProductSearchModel from '@/features/ProductSearch/model/ProductSearchModel.ts';
import ProductSortsModel from '@/features/ProductSorts/model/ProductSortsModel.ts';
import getCartModel from '@/shared/API/cart/model/CartModel.ts';
import getProductModel from '@/shared/API/product/model/ProductModel.ts';
import FilterProduct from '@/shared/API/product/utils/filter.ts';
import { FilterFields, SortDirection, SortFields } from '@/shared/API/types/type.ts';
import EventMediatorModel from '@/shared/EventMediator/model/EventMediatorModel.ts';
import LoaderModel from '@/shared/Loader/model/LoaderModel.ts';
import getStore from '@/shared/Store/Store.ts';
import MEDIATOR_EVENT from '@/shared/constants/events.ts';
import { META_FILTERS } from '@/shared/constants/filters.ts';
import { DEFAULT_PAGE, PRODUCT_LIMIT, SEARCH_PARAMS_FIELD } from '@/shared/constants/product.ts';
import { LOADER_SIZE } from '@/shared/constants/sizes.ts';
import { SORTING_ID } from '@/shared/constants/sorting.ts';
import { showErrorMessage } from '@/shared/utils/userMessage.ts';

import CatalogView from '../view/CatalogView.ts';

const PRODUCT_COUNT_FOR_HIDDEN_PAGINATION = 7;

class CatalogModel {
  private currentSize: null | string = null;

  private paginationBottom: PaginationModel | null = null;

  private paginationTop: PaginationModel | null = null;

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

  private decodeSearchParams(): {
    page: string;
    searchValue: null | string;
    selectedFilters: SelectedFilters;
    selectedSorting?: SelectedSorting;
  } {
    const searchParams = RouterModel.getSearchParams();
    const searchCategory = searchParams.getAll(SEARCH_PARAMS_FIELD.CATEGORY);
    searchCategory.push(...searchParams.getAll(SEARCH_PARAMS_FIELD.SUBCATEGORY));
    const category = new Set(searchCategory);
    const metaFilter = searchParams.get(SEARCH_PARAMS_FIELD.META) ?? META_FILTERS.en.ALL_PRODUCTS;
    const size = searchParams.get(SEARCH_PARAMS_FIELD.SIZE) ?? null;
    const price = {
      max: parseFloat(searchParams.get(SEARCH_PARAMS_FIELD.MAX_PRICE) ?? '0'),
      min: parseFloat(searchParams.get(SEARCH_PARAMS_FIELD.MIN_PRICE) ?? '0'),
    };

    const field = searchParams.get(SEARCH_PARAMS_FIELD.FIELD);
    const direction = searchParams.get(SEARCH_PARAMS_FIELD.DIRECTION);
    const searchValue = searchParams.get(SEARCH_PARAMS_FIELD.SEARCH) ?? null;
    const page = searchParams.get(SEARCH_PARAMS_FIELD.PAGE) ?? DEFAULT_PAGE.toString();
    const selectedFilters = {
      category,
      metaFilter,
      price,
      size,
    };

    return {
      page,
      searchValue,
      selectedFilters,
      ...(field && direction && { selectedSorting: { direction, field } }),
    };
  }

  private async drawProducts(): Promise<void> {
    const productList = this.view.getItemsList();
    productList.innerHTML = '';
    const options = this.getOptions();
    const productsInfo = await this.getProductsInfo(options);
    this.paginationTop?.getHTML().remove();
    this.paginationBottom?.getHTML().remove();
    if (productsInfo?.products?.length) {
      const cart = await getCartModel().getCart();
      productsInfo.products.forEach((productData) => {
        const product = new ProductCardModel(productData, this.currentSize, cart);
        productList.append(product.getHTML());
      });
      this.view.switchEmptyList(!productsInfo?.products?.length);
      this.paginationTop = new PaginationModel(
        { productTotalCount: productsInfo?.totalProductCount, productsPerPageCount: PRODUCT_LIMIT },
        this.setCurrentPage.bind(this),
      );
      this.paginationBottom = new PaginationModel(
        { productTotalCount: productsInfo?.totalProductCount, productsPerPageCount: PRODUCT_LIMIT },
        this.setCurrentPage.bind(this),
      );
      this.paginationTop.getView().setSelectedButton(options.page ?? DEFAULT_PAGE);
      this.paginationBottom.getView().setSelectedButton(options.page ?? DEFAULT_PAGE);
      this.view.getRightTopWrapper().append(this.paginationTop.getHTML());
      if (productsInfo.products.length >= PRODUCT_COUNT_FOR_HIDDEN_PAGINATION) {
        this.view.getRightBottomWrapper().append(this.paginationBottom.getHTML());
      }
    }
    this.productFilters?.getView().updateParams(productsInfo);
    this.view.switchEmptyList(!productsInfo?.products?.length);
  }

  private getOptions(): OptionsRequest {
    let result = {};

    const { page, searchValue, selectedFilters, selectedSorting } = this.decodeSearchParams();
    this.productFilters?.getView().setInitialActiveFilters({
      categoryLinks: Array.from(selectedFilters.category),
      metaLinks: selectedFilters.metaFilter ? [selectedFilters.metaFilter] : [],
      sizeLinks: selectedFilters.size ? [selectedFilters.size] : [],
    });
    const { currentLanguage } = getStore().getState();
    const filter = new FilterProduct();
    selectedFilters.category.forEach((categoryID) => filter.addFilter(FilterFields.CATEGORY, categoryID));

    if (selectedFilters.price && selectedFilters.price.max > selectedFilters.price.min) {
      filter.addFilter(FilterFields.PRICE, selectedFilters.price);
    }
    if (selectedFilters.size) {
      this.currentSize = selectedFilters.size;
      filter.addFilter(FilterFields.SIZE, selectedFilters.size);
    }

    this.addCurrentMetaFilter(filter, selectedFilters.metaFilter ?? META_FILTERS.en.ALL_PRODUCTS);

    const currentSort = this.getSelectedSorting(selectedSorting ?? null);
    if (currentSort) {
      result = {
        filter,
        page: Number(page),
        search: { locale: currentLanguage, value: searchValue },
        sort: currentSort ?? null,
      };
    } else {
      result = {
        filter,
        page: Number(page),
        search: { locale: currentLanguage, value: searchValue },
      };
    }

    return result;
  }

  private async getProductsInfo(options: OptionsRequest): Promise<ProductFiltersParams | null> {
    const productList = this.view.getItemsList();
    const loader = new LoaderModel(LOADER_SIZE.EXTRA_LARGE);
    loader.setAbsolutePosition();
    productList.append(loader.getHTML());

    try {
      const { categoryCount, priceRange, products, sizeCount, total } = await getProductModel().getProducts(options);
      return {
        categoriesProductCount: categoryCount,
        priceRange,
        products,
        sizes: sizeCount,
        totalProductCount: total,
      };
    } catch (error) {
      showErrorMessage(error);
    } finally {
      loader.getHTML().remove();
    }
    return null;
  }

  private getSelectedSorting(selectedSorting: SelectedSorting | null): SortOptions | null {
    if (!selectedSorting) {
      return null;
    }
    const { direction, field } = selectedSorting;
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
    EventMediatorModel.getInstance().subscribe(MEDIATOR_EVENT.REDRAW_PRODUCTS, this.drawProducts.bind(this));
    this.getProductsInfo({})
      .then((productsInfo) => {
        this.initSettingComponents(productsInfo);
        this.drawProducts().catch(showErrorMessage);
      })
      .catch(showErrorMessage);
  }

  private initSettingComponents(data: ProductFiltersParams | null): void {
    this.productFilters = new ProductFiltersModel(data, this.drawProducts.bind(this));
    this.productSorting = new ProductSortsModel(this.drawProducts.bind(this));
    this.productSearch = new ProductSearchModel(this.drawProducts.bind(this));

    this.view.getLeftWrapper().append(this.productFilters.getView().getDefaultFilters());
    this.view
      .getRightTopWrapper()
      .append(
        this.productFilters.getView().getMetaFilters(),
        this.productSorting.getHTML(),
        this.productSearch.getHTML(),
      );
  }

  private setCurrentPage(page: string): void {
    RouterModel.setSearchParams(SEARCH_PARAMS_FIELD.PAGE, page);
    this.drawProducts().catch(showErrorMessage);
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default CatalogModel;
