import type { UserLoginData, UserRegisterData } from '@/shared/types/user.ts';

import {
  type ByProjectKeyRequestBuilder,
  type CategoryPagedQueryResponse,
  type ClientResponse,
  type Customer,
  type CustomerPagedQueryResponse,
  type CustomerSignInResult,
  type CustomerUpdateAction,
  type Product,
  type ProductPagedQueryResponse,
  type ProductProjectionPagedSearchResponse,
  createApiBuilderFromCtpClient,
} from '@commercetools/platform-sdk';
import { type Client } from '@commercetools/sdk-client-v2';

import type { OptionsRequest, SortOptions } from '../types/type.ts';

import client from './client.ts';

type Nullable<T> = T | null;
const PRODUCT_LIMIT = 9;
const DEFAULT_PAGE = 1;
const MIN_PRICE = 0;
const MAX_PRICE = 1000000;

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
  private client: Client;

  private connection: ByProjectKeyRequestBuilder;

  private credentials: Credentials;

  constructor() {
    this.credentials = {
      clientID,
      clientSecret,
      projectKey,
      scopes,
    };

    this.client = client(
      this.credentials.projectKey || '',
      this.credentials.clientID || '',
      this.credentials.clientSecret || '',
      this.credentials.scopes || '',
    );

    this.connection = this.root(this.client, projectKey);
  }

  private makeSortRequest(sortOptions: SortOptions): string {
    return `${sortOptions.field}${sortOptions.locale ? `.${sortOptions.locale}` : ''} ${sortOptions.direction}`;
  }

  private root(client: Client, projectKey: string): ByProjectKeyRequestBuilder {
    return createApiBuilderFromCtpClient(client).withProjectKey({ projectKey });
  }

  public async authenticateUser(userLoginData: UserLoginData): Promise<ClientResponse<CustomerSignInResult>> {
    const data = await this.connection.login().post({ body: userLoginData }).execute();
    return data;
  }

  public async deleteCustomer(ID: string, version: number): Promise<ClientResponse<Customer>> {
    const data = await this.connection.customers().withId({ ID }).delete({ queryArgs: { version } }).execute();
    return data;
  }

  public async editCustomer(
    actions: CustomerUpdateAction[],
    version: number,
    ID: string,
  ): Promise<ClientResponse<Customer>> {
    const data = await this.connection.customers().withId({ ID }).post({ body: { actions, version } }).execute();
    return data;
  }

  public async editPassword(
    id: string,
    version: number,
    currentPassword: string,
    newPassword: string,
  ): Promise<ClientResponse<Customer>> {
    const data = await this.connection
      .customers()
      .password()
      .post({ body: { currentPassword, id, newPassword, version } })
      .execute();
    return data;
  }

  public async getCategories(): Promise<ClientResponse<CategoryPagedQueryResponse>> {
    const data = await this.connection.categories().get().execute();
    return data;
  }

  public async getCategoriesProductCount(): Promise<ClientResponse<ProductProjectionPagedSearchResponse>> {
    const data = await this.connection
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
    const data = await this.connection
      .customers()
      .get({ queryArgs: { where: `email="${email}"` } })
      .execute();
    return data;
  }

  public async getCustomerByID(ID: string): Promise<ClientResponse<Customer>> {
    const data = await this.connection.customers().withId({ ID }).get().execute();
    return data;
  }

  public async getPriceRange(): Promise<ClientResponse<ProductProjectionPagedSearchResponse>> {
    const data = await this.connection
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
    const data = await this.connection.products().withId({ ID }).get().execute();
    return data;
  }

  public async getProducts(options?: OptionsRequest): Promise<ClientResponse<ProductPagedQueryResponse>> {
    const { limit = PRODUCT_LIMIT, page = DEFAULT_PAGE, sort } = options || {};

    const data = await this.connection
      .products()
      .get({
        queryArgs: {
          limit,
          offset: (page - 1) * PRODUCT_LIMIT,
          ...(sort && { sort: this.makeSortRequest(sort) }),
          // where: `masterData(staged(variants(prices(value(centAmount >= 5000))) or
          // masterVariant(prices(value(centAmount >= 5000)))))`,
          // where: `key = 10594917538474`,
          withTotal: true,
        },
      })
      .execute();
    return data;
  }

  public async registrationUser(userRegisterData: UserRegisterData): Promise<ClientResponse<CustomerSignInResult>> {
    const userInfo = {
      email: userRegisterData.email,
      password: userRegisterData.password,
    };
    const data = await this.connection.customers().post({ body: userInfo }).execute();
    return data;
  }
}

const createRoot = (): RootApi => new RootApi();

const rootApi = createRoot();

export default function getRoot(): RootApi {
  return rootApi;
}
