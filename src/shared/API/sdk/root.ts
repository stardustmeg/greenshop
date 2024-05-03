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

  private root(client: Client, projectKey: string): ByProjectKeyRequestBuilder {
    return createApiBuilderFromCtpClient(client).withProjectKey({ projectKey });
  }

  public async authenticateUser(userLoginData: UserLoginData): Promise<ClientResponse<CustomerSignInResult> | Error> {
    const data = await this.connection.login().post({ body: userLoginData }).execute();
    return data;
  }

  public async editCustomer(
    actions: CustomerUpdateAction[],
    version: number,
    ID: string,
  ): Promise<ClientResponse<Customer> | Error> {
    const data = await this.connection
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
    const data = await this.connection
      .customers()
      .password()
      .post({ body: { currentPassword, id, newPassword, version } })
      .execute()
      .catch((err: Error) => err);
    return data;
  }

  public async getAllProducts(): Promise<ClientResponse<ProductPagedQueryResponse> | Error> {
    const data = await this.connection
      .products()
      .get()
      .execute()
      .catch((err: Error) => err);
    return data;
  }

  public async getCategories(): Promise<ClientResponse<CategoryPagedQueryResponse> | Error> {
    const data = await this.connection
      .categories()
      .get()
      .execute()
      .catch((err: Error) => err);
    return data;
  }

  public async getCustomerByEmail(email: string): Promise<ClientResponse<CustomerPagedQueryResponse> | Error> {
    const data = await this.connection
      .customers()
      .get({ queryArgs: { where: `email="${email}"` } })
      .execute()
      .catch((err: Error) => err);
    return data;
  }

  public async getCustomerByID(ID: string): Promise<ClientResponse<Customer> | Error> {
    const data = await this.connection
      .customers()
      .withId({ ID })
      .get()
      .execute()
      .catch((err: Error) => err);
    return data;
  }

  public async getProductByID(ID: string): Promise<ClientResponse<Product> | Error> {
    const data = await this.connection
      .products()
      .withId({ ID })
      .get()
      .execute()
      .catch((err: Error) => err);
    return data;
  }

  public async registrationUser(
    userRegisterData: UserRegisterData,
  ): Promise<ClientResponse<CustomerSignInResult> | Error> {
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
