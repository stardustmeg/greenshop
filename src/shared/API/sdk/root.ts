import {
  type ByProjectKeyRequestBuilder,
  type CategoryPagedQueryResponse,
  type ClientResponse,
  type Customer,
  type CustomerSignInResult,
  type CustomerUpdateAction,
  type Product,
  type ProductPagedQueryResponse,
  createApiBuilderFromCtpClient,
} from '@commercetools/platform-sdk';
import { type Client } from '@commercetools/sdk-client-v2';

import client from './client.ts';

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

export default class RootApi {
  private client: Client;

  private credentials: Credentials;

  private rootApi: ByProjectKeyRequestBuilder;

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

    this.rootApi = this.root(this.client, projectKey);
  }

  private root(client: Client, projectKey: string): ByProjectKeyRequestBuilder {
    return createApiBuilderFromCtpClient(client).withProjectKey({ projectKey });
  }

  public async authenticateUser(
    email: string,
    password: string,
  ): Promise<ClientResponse<CustomerSignInResult> | Error> {
    const data = await this.rootApi
      .login()
      .post({ body: { email, password } })
      .execute()
      .catch((err: Error) => err);
    return data;
  }

  public async editCustomer(
    actions: CustomerUpdateAction[],
    version: number,
    ID: string,
  ): Promise<ClientResponse<Customer> | Error> {
    const data = await this.rootApi
      .customers()
      .withId({ ID })
      .post({ body: { actions, version } })
      .execute()
      .catch((err: Error) => err);
    return data;
  }

  public async editPassword(
    id: string,
    version: number,
    currentPassword: string,
    newPassword: string,
  ): Promise<ClientResponse<Customer> | Error> {
    const data = await this.rootApi
      .customers()
      .password()
      .post({ body: { currentPassword, id, newPassword, version } })
      .execute()
      .catch((err: Error) => err);
    return data;
  }

  public async getAllProducts(): Promise<ClientResponse<ProductPagedQueryResponse> | Error> {
    const data = await this.rootApi
      .products()
      .get()
      .execute()
      .catch((err: Error) => err);
    return data;
  }

  public async getCategories(): Promise<ClientResponse<CategoryPagedQueryResponse> | Error> {
    const data = await this.rootApi
      .categories()
      .get()
      .execute()
      .catch((err: Error) => err);
    return data;
  }

  public async getCustomerByID(ID: string): Promise<ClientResponse<Customer> | Error> {
    const data = await this.rootApi
      .customers()
      .withId({ ID })
      .get()
      .execute()
      .catch((err: Error) => err);
    return data;
  }

  public async getProductByID(ID: string): Promise<ClientResponse<Product> | Error> {
    const data = await this.rootApi
      .products()
      .withId({ ID })
      .get()
      .execute()
      .catch((err: Error) => err);
    return data;
  }

  public async registrationUser(
    email: string,
    password: string,
  ): Promise<ClientResponse<CustomerSignInResult> | Error> {
    const data = await this.rootApi
      .customers()
      .post({ body: { email, password } })
      .execute()
      .catch((err: Error) => err);
    return data;
  }
}
