import type {
  CategoryPagedQueryResponse,
  ClientResponse,
  ProductProjection,
  ProductProjectionPagedSearchResponse,
} from '@commercetools/platform-sdk';

import { DEFAULT_PAGE, MAX_PRICE, MIN_PRICE, PRICE_FRACTIONS, PRODUCT_LIMIT } from '@/shared/constants/product.ts';

import getApiClient, { type ApiClient } from '../sdk/client.ts';
import { type OptionsRequest } from '../types/type.ts';
import makeSortRequest from './utils/sort.ts';

const Search = 'text';
const FACET_ADD = 1;
enum Facets {
  category = 'categories.id counting products',
  price = 'variants.price.centAmount',
  size = 'variants.attributes.size.key',
}
enum QueryParams {
  range = 'range',
}
export class ProductApi {
  private client: ApiClient;

  constructor() {
    this.client = getApiClient();
  }

  private getFuzzyLevel(value: string): number {
    if (value.length < 3) {
      return 0;
    }
    if (value.length < 5) {
      return 1;
    }
    return 2;
  }

  public async getCategories(): Promise<ClientResponse<CategoryPagedQueryResponse>> {
    const data = await this.client.apiRoot().categories().get().execute();
    return data;
  }

  public async getPriceRange(): Promise<ClientResponse<ProductProjectionPagedSearchResponse>> {
    const data = await this.client
      .apiRoot()
      .productProjections()
      .search()
      .get({
        queryArgs: {
          facet: [`${Facets.price}:${QueryParams.range}(${MIN_PRICE} to ${MAX_PRICE})`],
          limit: 0,
        },
      })
      .execute();
    return data;
  }

  public async getProductByKey(key: string): Promise<ClientResponse<ProductProjection>> {
    const data = await this.client.apiRoot().productProjections().withKey({ key }).get().execute();
    return data;
  }

  public async getProducts(options?: OptionsRequest): Promise<ClientResponse<ProductProjectionPagedSearchResponse>> {
    const { filter, limit = PRODUCT_LIMIT, page = DEFAULT_PAGE, search, sort } = options || {};
    const filterQuery = filter?.getFilter();
    const priceRange = filter?.getPriceRange();
    const min = Math.round((priceRange?.min ?? MIN_PRICE) * PRICE_FRACTIONS - FACET_ADD);
    const max = Math.round((priceRange?.max ?? MAX_PRICE) * PRICE_FRACTIONS + FACET_ADD);
    const fuzzyLevel = this.getFuzzyLevel(search?.value ? search?.value : '');

    const data = await this.client
      .apiRoot()
      .productProjections()
      .search()
      .get({
        queryArgs: {
          facet: [Facets.category, Facets.size, `${Facets.price}:${QueryParams.range}(${min} to ${max})`],
          limit,
          markMatchingVariants: true,
          offset: (page - 1) * PRODUCT_LIMIT,
          ...(search && { [`${Search}.${search.locale}`]: search.value }),
          ...(search && { fuzzy: true }),
          ...(search?.value && { fuzzyLevel }),
          ...(sort && { sort: makeSortRequest(sort) }),
          ...(filterQuery && { 'filter.query': filterQuery }),
          ...(filterQuery && { 'filter.facets': filterQuery }),
          withTotal: true,
        },
      })
      .execute();
    return data;
  }
}

const createProductApi = (): ProductApi => new ProductApi();

const productApi = createProductApi();

export default function getProductApi(): ProductApi {
  return productApi;
}
