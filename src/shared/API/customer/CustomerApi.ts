import type { User, UserCredentials } from '@/shared/types/user.ts';
import type {
  ClientResponse,
  Customer,
  CustomerPagedQueryResponse,
  CustomerSignInResult,
  MyCustomerDraft,
  MyCustomerUpdateAction,
} from '@commercetools/platform-sdk';

import findAddressIndex from '@/shared/utils/address.ts';

import getApiClient, { type ApiClient } from '../sdk/client.ts';
import { isErrorResponse } from '../types/validation.ts';

export class CustomerApi {
  private client: ApiClient;

  constructor() {
    this.client = getApiClient();
  }

  private makeCustomerDraft(userData: User): MyCustomerDraft {
    const billingAddress = userData.defaultBillingAddressId
      ? findAddressIndex(userData.addresses, userData.defaultBillingAddressId)
      : null;
    const shippingAddress = userData.defaultShippingAddressId
      ? findAddressIndex(userData.addresses, userData.defaultShippingAddressId)
      : null;

    return {
      addresses: [...userData.addresses],
      dateOfBirth: userData.birthDate,
      ...(billingAddress !== null && billingAddress >= 0 && { defaultBillingAddress: billingAddress }),
      ...(shippingAddress !== null && shippingAddress >= 0 && { defaultShippingAddress: shippingAddress }),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      locale: userData.locale,
      password: userData.password,
    };
  }

  public async authenticateUser(userLoginData: UserCredentials): Promise<ClientResponse<CustomerSignInResult>> {
    const client = this.client.createAuthConnection(userLoginData);
    const data = await client.me().login().post({ body: userLoginData }).execute();
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

  public async getCustomerByEmail(email: string): Promise<ClientResponse<CustomerPagedQueryResponse>> {
    const data = await this.client
      .apiRoot()
      .customers()
      .get({ queryArgs: { where: `email="${email}"` } })
      .execute();
    return data;
  }

  public logoutUser(): boolean {
    return this.client.deleteAuthConnection();
  }

  public async registrationUser(userData: User): Promise<ClientResponse<CustomerSignInResult>> {
    let data = await this.client
      .apiRoot()
      .me()
      .signup()
      .post({ body: this.makeCustomerDraft(userData) })
      .execute();
    if (!isErrorResponse(data)) {
      this.client.createAuthConnection(userData);
      this.client.approveAuth();
      // TBD: dele auth
      const auth = await this.authenticateUser(userData);
      if (!isErrorResponse(auth)) {
        data = auth;
      }
    }
    return data;
  }
}

const createCustomerApi = (): CustomerApi => new CustomerApi();

const customerApi = createCustomerApi();

export default function getCustomerApi(): CustomerApi {
  return customerApi;
}
