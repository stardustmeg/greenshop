import type { AuthCredentials, User, UserCredentials } from '@/shared/types/user.ts';
import type {
  CartResourceIdentifier,
  ClientResponse,
  Customer,
  CustomerPagedQueryResponse,
  CustomerSignInResult,
  MyCustomerDraft,
  MyCustomerUpdateAction,
} from '@commercetools/platform-sdk';

import getStore from '@/shared/Store/Store.ts';
import { setAnonymousCartId, setAnonymousId, setAnonymousShopListId } from '@/shared/Store/actions.ts';
import findAddressIndex from '@/shared/utils/address.ts';

import getCartModel from '../cart/model/CartModel.ts';
import getApiClient, { type ApiClient } from '../sdk/client.ts';
import getShoppingListModel from '../shopping-list/model/ShoppingListModel.ts';
import { isErrorResponse } from '../types/validation.ts';

interface ExtendedCustomerDraft extends MyCustomerDraft {
  billingAddresses?: number[];
  shippingAddresses?: number[];
}
const CART_MERGE_MODE = 'MergeWithExistingCustomerCart';
const CART_TYPE_ID = 'cart';
const EMAIL = 'email';

export default class CustomerApi {
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
      authData.anonymousCartSignInMode = CART_MERGE_MODE;
      authData.updateProductData = true;
    }
    return authData;
  }

  private async checkAuthConnection(authData: UserCredentials): Promise<boolean> {
    let isOk = false;
    this.client.deleteAuthConnection();
    const client = this.client.createAuthConnection(authData);
    const testConnect = await client.get().execute();
    if (!isErrorResponse(testConnect)) {
      this.client.approveAuth();
      getStore().dispatch(setAnonymousCartId(null));
      getStore().dispatch(setAnonymousId(null));
      getStore().dispatch(setAnonymousShopListId(null));
      isOk = true;
    }
    return isOk;
  }

  private makeCustomerDraft(userData: User): ExtendedCustomerDraft {
    const defaultBillingAddress = userData.defaultBillingAddressId
      ? findAddressIndex(userData.addresses, userData.defaultBillingAddressId)
      : null;
    const defaultShippingAddress = userData.defaultShippingAddressId
      ? findAddressIndex(userData.addresses, userData.defaultShippingAddressId)
      : null;
    const billingAddress = userData.billingAddress.length
      ? findAddressIndex(userData.addresses, userData.billingAddress[0])
      : null;
    const shippingAddress = userData.shippingAddress.length
      ? findAddressIndex(userData.addresses, userData.shippingAddress[0])
      : null;
    const { anonymousCartId, anonymousId } = getStore().getState();
    const anonymCart: CartResourceIdentifier | undefined = anonymousCartId
      ? {
          id: anonymousCartId,
          typeId: CART_TYPE_ID,
        }
      : undefined;
    return {
      addresses: [...userData.addresses],
      dateOfBirth: userData.birthDate,
      ...(defaultBillingAddress !== null && defaultBillingAddress >= 0 && { defaultBillingAddress }),
      ...(defaultShippingAddress !== null && defaultShippingAddress >= 0 && { defaultShippingAddress }),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      locale: userData.locale,
      password: userData.password,
      ...(anonymCart && { anonymousCart: anonymCart }),
      ...(anonymousId && { anonymousId }),
      ...(anonymCart && { anonymousCartSignInMode: CART_MERGE_MODE }),
      ...(anonymCart && { updateProductData: true }),
      billingAddresses: billingAddress !== null ? [billingAddress] : undefined,
      shippingAddresses: shippingAddress !== null ? [shippingAddress] : undefined,
    };
  }

  public async authenticateUser(userLoginData: UserCredentials): Promise<ClientResponse<CustomerSignInResult>> {
    const authData = this.cerateAuthData(userLoginData);
    const data = await this.client.apiRoot().me().login().post({ body: authData }).execute();
    if (!isErrorResponse(data)) {
      await this.checkAuthConnection(authData);
      await getCartModel().getCart();
      await getShoppingListModel().getShoppingList();
    }
    return data;
  }

  public async editCustomer(actions: MyCustomerUpdateAction[], version: number): Promise<ClientResponse<Customer>> {
    const data = await this.client.apiRoot().me().post({ body: { actions, version } }).execute();
    return data;
  }

  public async editPassword(
    customer: User,
    currentPassword: string,
    newPassword: string,
  ): Promise<ClientResponse<Customer>> {
    const data = await this.client
      .apiRoot()
      .me()
      .password()
      .post({ body: { currentPassword, newPassword, version: customer.version } })
      .execute();
    if (!isErrorResponse(data)) {
      const authData: UserCredentials = {
        email: customer.email,
        password: newPassword,
      };
      await this.checkAuthConnection(authData);
    }
    return data;
  }

  public async getCustomer(): Promise<ClientResponse<Customer>> {
    const data = await this.client.apiRoot().me().get().execute();
    return data;
  }

  public async getCustomerByEmail(email: string): Promise<ClientResponse<CustomerPagedQueryResponse>> {
    const data = await this.client
      .apiRoot()
      .customers()
      .get({ queryArgs: { where: `${EMAIL}="${email}"` } })
      .execute();
    return data;
  }

  public async logoutUser(): Promise<boolean> {
    const client = this.client.deleteAuthConnection();
    const testConnect = this.client.apiRoot().get().execute();
    await getCartModel().getCart();
    await getShoppingListModel().getShoppingList();
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
      await this.checkAuthConnection(userData);
      await getCartModel().getCart();
      await getShoppingListModel().getShoppingList();
    }
    return data;
  }
}
