import type {
  CategoryPagedQueryResponse,
  ClientResponse,
  Product,
  ProductProjectionPagedSearchResponse,
} from '@commercetools/platform-sdk';

import { DEFAULT_PAGE, MAX_PRICE, MIN_PRICE, PRODUCT_LIMIT } from '@/shared/constants/product.ts';

import getApiClient, { type ApiClient } from '../sdk/client.ts';
import { type OptionsRequest } from '../types/type.ts';
import makeSortRequest from './utils/sort.ts';

export class ProductApi {
  private client: ApiClient;

  constructor() {
    this.client = getApiClient();
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
          facet: [`variants.price.centAmount:range(${MIN_PRICE} to ${MAX_PRICE})`],
          limit: 0,
        },
      })
      .execute();
    return data;
  }

  public async getProductByID(ID: string): Promise<ClientResponse<Product>> {
    const data = await this.client.apiRoot().products().withId({ ID }).get().execute();
    return data;
  }

  public async getProducts(options?: OptionsRequest): Promise<ClientResponse<ProductProjectionPagedSearchResponse>> {
    const { filter, limit = PRODUCT_LIMIT, page = DEFAULT_PAGE, search, sort } = options || {};

    const data = await this.client
      .apiRoot()
      .productProjections()
      .search()
      .get({
        queryArgs: {
          facet: [
            `categories.id counting products`,
            `variants.attributes.size.key`,
            `variants.price.centAmount:range(${MIN_PRICE} to ${MAX_PRICE})`,
          ],
          limit,
          markMatchingVariants: true,
          offset: (page - 1) * PRODUCT_LIMIT,
          ...(search && { [`text.${search.locale}`]: search.value }),
          ...(search && { fuzzy: true }),
          ...(sort && { sort: makeSortRequest(sort) }),
          ...(filter && { 'filter.query': filter }),
          ...(filter && { 'filter.facets': filter }),
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
