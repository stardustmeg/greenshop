import type { User, UserCredentials } from '@/shared/types/user.ts';

import { DEFAULT_PAGE, MAX_PRICE, MIN_PRICE, PRODUCT_LIMIT } from '@/shared/constants/product.ts';
import {
  type CategoryPagedQueryResponse,
  type ClientResponse,
  type Customer,
  type CustomerPagedQueryResponse,
  type CustomerSignInResult,
  type MyCustomerUpdateAction,
  type Product,
  type ProductProjectionPagedQueryResponse,
  type ProductProjectionPagedSearchResponse,
} from '@commercetools/platform-sdk';

import makeSortRequest from '../product/utils/sort.ts';
import { type OptionsRequest, TokenType } from '../types/type.ts';
import { isErrorResponse } from '../types/validation.ts';
import ApiClient from './client.ts';
import getTokenCache from './token-cache/token-cache.ts';

type Nullable<T> = T | null;

export type Credentials = {
  clientID: Nullable<string>;
  clientSecret: Nullable<string>;
  projectKey: Nullable<string>;
  scopes: Nullable<string>;
};

const projectKey = import.meta.env.VITE_APP_CTP_PROJECT_KEY;
const scopes = import.meta.env.VITE_APP_CTP_SCOPES;
const clientID = import.meta.env.VITE_APP_CTP_CLIENT_ID;
const clientSecret = import.meta.env.VITE_APP_CTP_CLIENT_SECRET;

export class RootApi {
  private client: ApiClient;

  private credentials: Credentials;

  constructor() {
    this.credentials = {
      clientID,
      clientSecret,
      projectKey,
      scopes,
    };

    this.client = new ApiClient(
      this.credentials.projectKey || '',
      this.credentials.clientID || '',
      this.credentials.clientSecret || '',
      this.credentials.scopes || '',
    );
  }

  public async authenticateUser(userLoginData: UserCredentials): Promise<ClientResponse<CustomerSignInResult>> {
    this.client.createAuthConnection(userLoginData);
    const data = await this.client.apiRoot().me().login().post({ body: userLoginData }).execute();
    if (!isErrorResponse(data)) {
      this.client.approveAuth();
    }
    return data;
  }

  public async deleteCustomer(ID: string, version: number): Promise<ClientResponse<Customer>> {
    const data = await this.client.adminRoot().customers().withId({ ID }).delete({ queryArgs: { version } }).execute();
    this.logoutUser();
    return data;
  }

  public async editCustomer(actions: MyCustomerUpdateAction[], version: number): Promise<ClientResponse<Customer>> {
    const data = await this.client.apiRoot().me().post({ body: { actions, version } }).execute();
    return data;
  }

  public async editPassword(
    version: number,
    currentPassword: string,
    newPassword: string,
  ): Promise<ClientResponse<Customer>> {
    const data = await this.client
      .apiRoot()
      .me()
      .password()
      .post({ body: { currentPassword, newPassword, version } })
      .execute();
    return data;
  }

  public async getCategories(): Promise<ClientResponse<CategoryPagedQueryResponse>> {
    const data = await this.client.apiRoot().categories().get().execute();
    return data;
  }

  public async getCategoriesProductCount(): Promise<ClientResponse<ProductProjectionPagedSearchResponse>> {
    const data = await this.client
      .apiRoot()
      .productProjections()
      .search()
      .get({
        queryArgs: {
          facet: [`categories.id counting products`],
          limit: 0,
        },
      })
      .execute();
    return data;
  }

  public async getCustomerByEmail(email: string): Promise<ClientResponse<CustomerPagedQueryResponse>> {
    const data = await this.client
      .apiRoot()
      .customers()
      .get({ queryArgs: { where: `email="${email}"` } })
      .execute();
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

  public async getProducts(options?: OptionsRequest): Promise<ClientResponse<ProductProjectionPagedQueryResponse>> {
    const { filter, limit = PRODUCT_LIMIT, page = DEFAULT_PAGE, search, sort } = options || {};

    const data = await this.client
      .apiRoot()
      .productProjections()
      .search()
      .get({
        queryArgs: {
          limit,
          markMatchingVariants: true,
          offset: (page - 1) * PRODUCT_LIMIT,
          ...(search && { [`text.${search.locale}`]: search.value }),
          ...(search && { fuzzy: true }),
          ...(sort && { sort: makeSortRequest(sort) }),
          ...(filter && { filter }),
          withTotal: true,
        },
      })
      .execute();
    return data;
  }

  public async getSizeProductCount(): Promise<ClientResponse<ProductProjectionPagedSearchResponse>> {
    const data = await this.client
      .apiRoot()
      .productProjections()
      .search()
      .get({
        queryArgs: {
          facet: [`variants.attributes.size.key`],
          limit: 0,
        },
      })
      .execute();
    return data;
  }

  public logoutUser(): boolean {
    getTokenCache(TokenType.AUTH).clear();
    return this.client.deleteAuthConnection();
  }

  public async registrationUser(userData: User): Promise<ClientResponse<CustomerSignInResult>> {
    const userCredentials = {
      email: userData.email,
      password: userData.password,
    };

    const data = await this.client.apiRoot().me().signup().post({ body: userCredentials }).execute();
    if (!isErrorResponse(data)) {
      this.client.createAuthConnection(userData);
      this.client.approveAuth();
    }
    return data;
  }
}

const createRoot = (): RootApi => new RootApi();

const rootApi = createRoot();

export default function getRoot(): RootApi {
  return rootApi;
}
