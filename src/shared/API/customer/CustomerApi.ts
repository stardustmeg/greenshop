import type { AuthCredentials, User, UserCredentials } from '@/shared/types/user.ts';
import type {
  ClientResponse,
  Customer,
  CustomerPagedQueryResponse,
  CustomerSignInResult,
  MyCustomerDraft,
  MyCustomerUpdateAction,
} from '@commercetools/platform-sdk';

import getStore from '@/shared/Store/Store.ts';
import { setAnonymousCartId, setAnonymousId } from '@/shared/Store/actions.ts';
import findAddressIndex from '@/shared/utils/address.ts';

import getCartModel from '../cart/model/CartModel.ts';
import getApiClient, { type ApiClient } from '../sdk/client.ts';
import { isErrorResponse } from '../types/validation.ts';

export class CustomerApi {
  private client: ApiClient;

  constructor() {
    this.client = getApiClient();
  }

  private cerateAuthData(userLoginData: UserCredentials): UserCredentials {
    const authData: AuthCredentials = {
      email: userLoginData.email,
      password: userLoginData.password,
    };
    const { anonymousCartId, anonymousId } = getStore().getState();

    if (anonymousCartId && anonymousId) {
      authData.anonymousCartId = anonymousCartId;
      authData.anonymousId = anonymousId;
      authData.anonymousCartSignInMode = 'MergeWithExistingCustomerCart';
      authData.updateProductData = true;
    }
    return authData;
  }

  private checkAuthConnection(authData: UserCredentials): boolean {
    let isOk = false;
    const client = this.client.createAuthConnection(authData);
    const testConnect = client.get().execute();
    if (!isErrorResponse(testConnect)) {
      this.client.approveAuth();
      getCartModel().clear();
      getStore().dispatch(setAnonymousCartId(null));
      getStore().dispatch(setAnonymousId(null));
      isOk = true;
    }
    return isOk;
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
    const authData = this.cerateAuthData(userLoginData);
    const data = await this.client.apiRoot().me().login().post({ body: authData }).execute();
    if (!isErrorResponse(data)) {
      this.checkAuthConnection(authData);
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
    const client = this.client.deleteAuthConnection();
    const testConnect = this.client.apiRoot().get().execute();
    return client && !isErrorResponse(testConnect);
  }

  public async registrationUser(userData: User): Promise<ClientResponse<CustomerSignInResult>> {
    const data = await this.client
      .apiRoot()
      .me()
      .signup()
      .post({ body: this.makeCustomerDraft(userData) })
      .execute();
    if (!isErrorResponse(data)) {
      const auth = this.checkAuthConnection(userData);
      // this.client.createAuthConnection(userData);
      // this.client.approveAuth();
      // // TBD: dele auth
      // const auth = await this.authenticateUser(userData);
      if (!isErrorResponse(auth)) {
        await getCartModel().create();
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
