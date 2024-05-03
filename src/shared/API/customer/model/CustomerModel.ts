import type { Address, User, UserLoginData, UserRegisterData } from '@/shared/types/user.ts';
import type {
  BaseAddress,
  ClientResponse,
  Customer,
  CustomerPagedQueryResponse,
  CustomerSignInResult,
  CustomerUpdateAction,
} from '@commercetools/platform-sdk';

import getRoot, { type RootApi } from '../../sdk/root.ts';
import {
  isClientResponse,
  isCustomerPagedQueryResponse,
  isCustomerResponse,
  isCustomerSignInResultResponse,
} from '../../types/validation.ts';

export class CustomerModel {
  private root: RootApi;

  constructor() {
    this.root = getRoot();
  }

  public static actionAddAddress(value: Address): CustomerUpdateAction {
    return { action: 'addAddress', address: CustomerModel.adaptAddressToServer(value) };
  }

  public static actionEditAddress(value: Address): CustomerUpdateAction {
    return { action: 'changeAddress', address: CustomerModel.adaptAddressToServer(value), addressId: value.id };
  }

  public static actionEditDateOfBirth(value: string): CustomerUpdateAction {
    return { action: 'setDateOfBirth', dateOfBirth: value };
  }

  public static actionEditDefaultBillingAddress(value: string): CustomerUpdateAction {
    return { action: 'setDefaultBillingAddress', addressId: value };
  }

  public static actionEditDefaultShippingAddress(value: string): CustomerUpdateAction {
    return { action: 'setDefaultShippingAddress', addressId: value };
  }

  public static actionEditEmail(value: string): CustomerUpdateAction {
    return { action: 'changeEmail', email: value };
  }

  public static actionEditFirstName(value: string): CustomerUpdateAction {
    return { action: 'setFirstName', firstName: value };
  }

  public static actionEditLastName(value: string): CustomerUpdateAction {
    return { action: 'setLastName', lastName: value };
  }

  public static actionRemoveAddress(value: Address): CustomerUpdateAction {
    return { action: 'removeAddress', addressId: value.id };
  }

  public static actionRemoveBillingAddress(value: Address): CustomerUpdateAction {
    return { action: 'removeBillingAddressId', addressId: value.id };
  }

  public static actionRemoveShippingAddress(value: Address): CustomerUpdateAction {
    return { action: 'removeShippingAddressId', addressId: value.id };
  }

  private static adaptAddressToServer(data: Address): BaseAddress {
    return {
      city: data.city,
      country: data.country,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      postalCode: data.postalCode,
      state: data.state,
      streetName: data.streetName,
      streetNumber: data.streetNumber,
    };
  }

  private adaptCustomerToClient(data: Customer): User {
    const adaptedCustomer: User = {
      addresses: data.addresses.map((address) => ({
        city: address.city || '',
        country: address.country || '',
        email: address.email || '',
        firstName: address.firstName || '',
        id: address.id || '',
        lastName: address.lastName || '',
        postalCode: address.postalCode || '',
        state: address.state || '',
        streetName: address.streetName || '',
        streetNumber: address.streetNumber || '',
      })),
      defaultBillingAddressId: null,
      defaultShippingAddressId: null,
      email: data.email || '',
      firstName: data.firstName || '',
      id: data.id || '',
      lastName: data.lastName || '',
      password: data.password || '',
      version: data.version || 0,
    };

    if (data.defaultBillingAddressId) {
      const address = adaptedCustomer.addresses.find((address) => address.id === data.defaultBillingAddressId);
      adaptedCustomer.defaultBillingAddressId = address || null;
    }
    if (data.defaultShippingAddressId) {
      const address = adaptedCustomer.addresses.find((address) => address.id === data.defaultShippingAddressId);
      adaptedCustomer.defaultShippingAddressId = address || null;
    }
    return adaptedCustomer;
  }

  private adaptSignInToClient(data: CustomerSignInResult): User {
    const adaptedCustomer: User = {
      addresses: data.customer.addresses.map((address) => ({
        city: address.city || '',
        country: address.country || '',
        email: address.email || '',
        firstName: address.firstName || '',
        id: address.id || '',
        lastName: address.lastName || '',
        postalCode: address.postalCode || '',
        state: address.state || '',
        streetName: address.streetName || '',
        streetNumber: address.streetNumber || '',
      })),
      defaultBillingAddressId: null,
      defaultShippingAddressId: null,
      email: data.customer.email || '',
      firstName: data.customer.firstName || '',
      id: data.customer.id || '',
      lastName: data.customer.lastName || '',
      password: data.customer.password || '',
      version: data.customer.version || 0,
    };

    if (data.customer.defaultBillingAddressId) {
      const address = adaptedCustomer.addresses.find((address) => address.id === data.customer.defaultBillingAddressId);
      if (address) {
        adaptedCustomer.defaultBillingAddressId = address;
      }
    }
    if (data.customer.defaultShippingAddressId) {
      const address = adaptedCustomer.addresses.find(
        (address) => address.id === data.customer.defaultShippingAddressId,
      );
      if (address) {
        adaptedCustomer.defaultShippingAddressId = address;
      }
    }
    return adaptedCustomer;
  }

  private getCustomerFromData(
    data: ClientResponse<Customer | CustomerPagedQueryResponse | CustomerSignInResult> | Error,
  ): User | null {
    let customer: User | null = null;
    if (isClientResponse(data)) {
      if (isCustomerSignInResultResponse(data.body)) {
        customer = this.adaptSignInToClient(data.body);
      } else if (isCustomerResponse(data.body)) {
        customer = this.adaptCustomerToClient(data.body);
      } else if (isCustomerPagedQueryResponse(data.body)) {
        customer = data.body.results.length > 0 ? this.adaptCustomerToClient(data.body.results[0]) : null;
      }
    }
    return customer;
  }

  public async authCustomer(userLoginData: UserLoginData): Promise<User | null> {
    const data = await this.root.authenticateUser(userLoginData);
    return this.getCustomerFromData(data);
  }

  public async editCustomer(actions: CustomerUpdateAction[], customer: User): Promise<User | null> {
    const data = await this.root.editCustomer(actions, customer.version, customer.id);
    return this.getCustomerFromData(data);
  }

  public async isValidEmail(email: string): Promise<boolean> {
    const data = await this.root.getCustomerByEmail(email);
    return this.getCustomerFromData(data) !== null;
  }

  public async registrationNewCustomer(userRegisterData: UserRegisterData): Promise<User | null> {
    const data = await this.root.registrationUser(userRegisterData);
    return this.getCustomerFromData(data);
  }
}

const createCustomerModel = (): CustomerModel => new CustomerModel();

const customerModel = createCustomerModel();

export default function getCustomerModel(): CustomerModel {
  return customerModel;
}