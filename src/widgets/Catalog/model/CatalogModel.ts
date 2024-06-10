import type { OptionsRequest, SortOptions } from '@/shared/API/types/type.ts';
import type { Category } from '@/shared/types/product.ts';
import type ProductFiltersParams from '@/shared/types/productFilters.ts';
import type { SelectedFilters } from '@/shared/types/productFilters.ts';
import type { SelectedSorting } from '@/shared/types/productSorting.ts';

import { set } from '@/app/Router/helpers/helpers.ts';
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
import modal from '@/shared/Modal/model/ModalModel.ts';
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

  private productCards: ProductCardModel[] = [];

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

  private async decodeSearchParams(): Promise<{
    page: string;
    searchValue: null | string;
    selectedFilters: SelectedFilters;
    selectedSorting?: SelectedSorting | undefined;
  } | null> {
    if (RouterModel.getPageID()) {
      return null;
    }
    const searchParams = RouterModel.getSearchParams();
    const searchCategory = searchParams.getAll(SEARCH_PARAMS_FIELD.CATEGORY);
    searchCategory.push(...searchParams.getAll(SEARCH_PARAMS_FIELD.SUBCATEGORY));
    const categorySetWithKey = new Set(searchCategory);
    const categories = await getProductModel().getCategories();
    const categorySetWithID: Set<string> = this.replaceCategoryKeyWithID(categories, categorySetWithKey);

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
      category: categorySetWithID,
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
    this.productCards = [];
    const productList = this.view.getItemsList();
    productList.innerHTML = '';
    const options = await this.getOptions();
    const productsInfo = await this.getProductsInfo(options);
    this.paginationTop?.getHTML().remove();
    this.paginationBottom?.getHTML().remove();
    if (productsInfo?.products?.length) {
      const cart = await getCartModel().getCart();
      productsInfo.products.forEach((productData) => {
        const product = new ProductCardModel(productData, this.currentSize, cart);
        productList.append(product.getHTML());
        this.productCards.push(product);
      });
      this.view.switchEmptyList(!productsInfo?.products?.length);
      this.paginationTop = new PaginationModel(
        { productTotalCount: productsInfo?.totalProductCount, productsPerPageCount: PRODUCT_LIMIT },
        this.setCurrentPage.bind(this),
      );
      this.paginationBottom = new PaginationModel(
        { productTotalCount: productsInfo?.totalProductCount, productsPerPageCount: PRODUCT_LIMIT },
        (page) => {
          this.setCurrentPage(page);
          scrollTo(0, 0);
        },
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

  private async getOptions(): Promise<OptionsRequest> {
    let result = {};

    const params = await this.decodeSearchParams();
    if (!params) {
      return {};
    }
    this.productFilters?.getView().setInitialActiveFilters({
      categoryLinks: Array.from(params.selectedFilters.category),
      metaLinks: params.selectedFilters.metaFilter ? [params.selectedFilters.metaFilter] : [],
      sizeLinks: params.selectedFilters.size ? [params.selectedFilters.size] : [],
    });
    const { currentLanguage } = getStore().getState();
    const filter = new FilterProduct();
    params.selectedFilters.category.forEach((categoryID) => filter.addFilter(FilterFields.CATEGORY, categoryID));

    if (params.selectedFilters.price && params.selectedFilters.price.max > params.selectedFilters.price.min) {
      filter.addFilter(FilterFields.PRICE, params.selectedFilters.price);
    }
    if (params.selectedFilters.size) {
      this.currentSize = params.selectedFilters.size;
      filter.addFilter(FilterFields.SIZE, params.selectedFilters.size);
    }

    this.addCurrentMetaFilter(filter, params.selectedFilters.metaFilter ?? META_FILTERS.en.ALL_PRODUCTS);

    const currentSort = this.getSelectedSorting(params.selectedSorting ?? null);
    if (currentSort) {
      result = {
        filter,
        page: Number(params.page),
        search: params.searchValue ? { locale: currentLanguage, value: params.searchValue } : null,
        sort: currentSort ?? null,
      };
    } else {
      result = {
        filter,
        page: Number(params.page),
        search: params.searchValue ? { locale: currentLanguage, value: params.searchValue } : null,
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
    modal.hide();
    EventMediatorModel.getInstance().subscribe(MEDIATOR_EVENT.REDRAW_PRODUCTS, this.drawProducts.bind(this));
    this.getProductsInfo({})
      .then((productsInfo) => {
        this.initSettingComponents(productsInfo);
        this.drawProducts()
          .then(() => this.openProductInfo())
          .catch(showErrorMessage);
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

  private openProductInfo(): void {
    if (RouterModel.getPageID()) {
      this.productCards.find((productCard) => productCard.getKey() === RouterModel.getPageID())?.openProductInfoModal();
    }
  }

  private replaceCategoryKeyWithID(categories: Category[], categorySet: Set<string>): Set<string> {
    const categoriesWithID: Set<string> = new Set();
    categories.forEach((category) => {
      categorySet.forEach((item) => {
        if (category.key === item) {
          categoriesWithID.add(category.id);
        } else if (category.parent?.key === item) {
          categoriesWithID.add(category.parent.id);
        }
      });
    });

    return categoriesWithID;
  }

  private setCurrentPage(page: string): void {
    RouterModel.changeSearchParams((url) => set(url, SEARCH_PARAMS_FIELD.PAGE, page));
    this.drawProducts().catch(showErrorMessage);
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default CatalogModel;
