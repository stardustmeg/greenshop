import type { Address, User, UserCredentials } from '@/shared/types/user.ts';
import type {
  Address as AddressResponse,
  BaseAddress,
  ClientResponse,
  Customer,
  CustomerPagedQueryResponse,
  CustomerSignInResult,
  MyCustomerUpdateAction,
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

  public static actionAddAddress(address: Address): MyCustomerUpdateAction {
    return { action: 'addAddress', address: CustomerModel.adaptAddressToServer(address) };
  }

  public static actionEditAddress(address: Address): MyCustomerUpdateAction {
    return { action: 'changeAddress', address: CustomerModel.adaptAddressToServer(address), addressId: address.id };
  }

  public static actionEditDateOfBirth(dateOfBirth: string): MyCustomerUpdateAction {
    return { action: 'setDateOfBirth', dateOfBirth };
  }

  public static actionEditDefaultBillingAddress(addressId: string): MyCustomerUpdateAction {
    return { action: 'setDefaultBillingAddress', addressId };
  }

  public static actionEditDefaultShippingAddress(addressId: string): MyCustomerUpdateAction {
    return { action: 'setDefaultShippingAddress', addressId };
  }

  public static actionEditEmail(email: string): MyCustomerUpdateAction {
    return { action: 'changeEmail', email };
  }

  public static actionEditFirstName(firstName: string): MyCustomerUpdateAction {
    return { action: 'setFirstName', firstName };
  }

  public static actionEditLastName(lastName: string): MyCustomerUpdateAction {
    return { action: 'setLastName', lastName };
  }

  public static actionRemoveAddress(address: Address): MyCustomerUpdateAction {
    return { action: 'removeAddress', addressId: address.id };
  }

  public static actionRemoveBillingAddress(address: Address): MyCustomerUpdateAction {
    return { action: 'removeBillingAddressId', addressId: address.id };
  }

  public static actionRemoveShippingAddress(address: Address): MyCustomerUpdateAction {
    return { action: 'removeShippingAddressId', addressId: address.id };
  }

  public static actionSetLocale(locale: string): MyCustomerUpdateAction {
    return { action: 'setLocale', locale };
  }

  private adaptAddress(address: AddressResponse[]): Address[] {
    return address.map((addressItem) => ({
      city: addressItem?.city || '',
      country: addressItem?.country || '',
      email: addressItem?.email || '',
      firstName: addressItem?.firstName || '',
      id: addressItem?.id || '',
      lastName: addressItem?.lastName || '',
      postalCode: addressItem?.postalCode || '',
      state: addressItem?.state || '',
      streetName: addressItem?.streetName || '',
      streetNumber: addressItem?.streetNumber || '',
    }));
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

  private adaptCustomerData(customerData: { customer: Customer } | Customer): User {
    const data = 'customer' in customerData ? customerData.customer : customerData;

    return {
      addresses: this.adaptAddress(data.addresses),
      birthDate: data.dateOfBirth || '',
      defaultBillingAddressId: null,
      defaultShippingAddressId: null,
      email: data.email || '',
      firstName: data.firstName || '',
      id: data.id || '',
      lastName: data.lastName || '',
      locale: data.locale || 'en',
      password: data.password || '',
      version: data.version || 0,
    };
  }

  private adaptCustomerToClient(data: Customer): User {
    const adaptedCustomer = this.adaptCustomerData(data);

    adaptedCustomer.defaultBillingAddressId = this.adaptDefaultAddress(
      data.defaultBillingAddressId,
      adaptedCustomer.addresses,
    );
    adaptedCustomer.defaultShippingAddressId = this.adaptDefaultAddress(
      data.defaultShippingAddressId,
      adaptedCustomer.addresses,
    );
    return adaptedCustomer;
  }

  private adaptDefaultAddress(addressId: string | undefined, address: Address[]): Address | null {
    if (addressId) {
      const addressFound = address.find((address) => address.id === addressId);
      return addressFound || null;
    }
    return null;
  }

  private adaptSignInToClient(data: CustomerSignInResult): User {
    const adaptedCustomer = this.adaptCustomerData(data);

    adaptedCustomer.defaultBillingAddressId = this.adaptDefaultAddress(
      data.customer.defaultBillingAddressId,
      adaptedCustomer.addresses,
    );
    adaptedCustomer.defaultShippingAddressId = this.adaptDefaultAddress(
      data.customer.defaultShippingAddressId,
      adaptedCustomer.addresses,
    );
    return adaptedCustomer;
  }

  private getCustomerFromData(
    data: ClientResponse<Customer | CustomerPagedQueryResponse | CustomerSignInResult>,
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

  public async authCustomer(userLoginData: UserCredentials): Promise<User | null> {
    const data = await this.root.authenticateUser(userLoginData);
    return this.getCustomerFromData(data);
  }

  public async deleteCustomer(customer: User): Promise<boolean> {
    const data = await this.root.deleteCustomer(customer.id, customer.version);
    return this.getCustomerFromData(data) !== null;
  }

  public async editCustomer(actions: MyCustomerUpdateAction[], customer: User): Promise<User | null> {
    const data = await this.root.editCustomer(actions, customer.version);
    return this.getCustomerFromData(data);
  }

  public async editPassword(customer: User, currentPassword: string, newPassword: string): Promise<User | null> {
    const data = await this.root.editPassword(customer.version, currentPassword, newPassword);
    return this.getCustomerFromData(data);
  }

  public async hasEmail(email: string): Promise<User | null> {
    const data = await this.root.getCustomerByEmail(email);
    return this.getCustomerFromData(data);
  }

  public logout(): boolean {
    return this.root.logoutUser();
  }

  public async registerNewCustomer(userData: User): Promise<User | null> {
    const data = await this.root.registrationUser(userData);
    return this.getCustomerFromData(data);
  }
}

const createCustomerModel = (): CustomerModel => new CustomerModel();

const customerModel = createCustomerModel();

export default function getCustomerModel(): CustomerModel {
  return customerModel;
}
