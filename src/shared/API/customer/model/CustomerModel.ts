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

import { LANGUAGE_CHOICE } from '@/shared/constants/common.ts';

import {
  isClientResponse,
  isCustomerPagedQueryResponse,
  isCustomerResponse,
  isCustomerSignInResultResponse,
} from '../../types/validation.ts';
import getCustomerApi, { type CustomerApi } from '../CustomerApi.ts';

const CUSTOMER_FIELD = 'customer';

enum Actions {
  addAddress = 'addAddress',
  addBillingAddressId = 'addBillingAddressId',
  addShippingAddressId = 'addShippingAddressId',
  changeAddress = 'changeAddress',
  changeEmail = 'changeEmail',
  removeAddress = 'removeAddress',
  removeBillingAddressId = 'removeBillingAddressId',
  removeShippingAddressId = 'removeShippingAddressId',
  setDateOfBirth = 'setDateOfBirth',
  setDefaultBillingAddress = 'setDefaultBillingAddress',
  setDefaultShippingAddress = 'setDefaultShippingAddress',
  setFirstName = 'setFirstName',
  setLastName = 'setLastName',
  setLocale = 'setLocale',
}
export class CustomerModel {
  private anonymousId = '';

  private root: CustomerApi;

  constructor() {
    this.root = getCustomerApi();
  }

  public static actionAddAddress(address: Address): MyCustomerUpdateAction {
    return { action: Actions.addAddress, address: CustomerModel.adaptAddressToServer(address) };
  }

  public static actionAddBillingAddress(addressId: string): MyCustomerUpdateAction {
    return { action: Actions.addBillingAddressId, addressId };
  }

  public static actionAddShippingAddress(addressId: string): MyCustomerUpdateAction {
    return { action: Actions.addShippingAddressId, addressId };
  }

  public static actionEditAddress(address: Address): MyCustomerUpdateAction {
    return {
      action: Actions.changeAddress,
      address: CustomerModel.adaptAddressToServer(address),
      addressId: address.id,
    };
  }

  public static actionEditDateOfBirth(dateOfBirth: string): MyCustomerUpdateAction {
    return { action: Actions.setDateOfBirth, dateOfBirth };
  }

  public static actionEditDefaultBillingAddress(addressId?: string): MyCustomerUpdateAction {
    return { action: Actions.setDefaultBillingAddress, addressId };
  }

  public static actionEditDefaultShippingAddress(addressId?: string): MyCustomerUpdateAction {
    return { action: Actions.setDefaultShippingAddress, addressId };
  }

  public static actionEditEmail(email: string): MyCustomerUpdateAction {
    return { action: Actions.changeEmail, email };
  }

  public static actionEditFirstName(firstName: string): MyCustomerUpdateAction {
    return { action: Actions.setFirstName, firstName };
  }

  public static actionEditLastName(lastName: string): MyCustomerUpdateAction {
    return { action: Actions.setLastName, lastName };
  }

  public static actionRemoveAddress(address: Address): MyCustomerUpdateAction {
    return { action: Actions.removeAddress, addressId: address.id };
  }

  public static actionRemoveBillingAddress(address: Address): MyCustomerUpdateAction {
    return { action: Actions.removeBillingAddressId, addressId: address.id };
  }

  public static actionRemoveShippingAddress(address: Address): MyCustomerUpdateAction {
    return { action: Actions.removeShippingAddressId, addressId: address.id };
  }

  public static actionSetLocale(locale: string): MyCustomerUpdateAction {
    return { action: Actions.setLocale, locale };
  }

  private adaptAddress(address: AddressResponse[]): Address[] {
    return address.map((addressItem) => ({
      city: addressItem?.city ?? '',
      country: addressItem?.country ?? '',
      email: addressItem?.email ?? '',
      firstName: addressItem?.firstName ?? '',
      id: addressItem?.id ?? '',
      lastName: addressItem?.lastName ?? '',
      postalCode: addressItem?.postalCode ?? '',
      state: addressItem?.state ?? '',
      streetName: addressItem?.streetName ?? '',
      streetNumber: addressItem?.streetNumber ?? '',
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
    const data = CUSTOMER_FIELD in customerData ? customerData.customer : customerData;

    return {
      addresses: this.adaptAddress(data.addresses),
      billingAddress: [],
      birthDate: data.dateOfBirth ?? '',
      defaultBillingAddressId: null,
      defaultShippingAddressId: null,
      email: data.email ?? '',
      firstName: data.firstName ?? '',
      id: data.id ?? '',
      lastName: data.lastName ?? '',
      locale: data.locale ?? LANGUAGE_CHOICE.EN,
      password: data.password ?? '',
      shippingAddress: [],
      version: data.version ?? 0,
    };
  }

  private adaptCustomerToClient(data: Customer): User {
    const adaptedCustomer = this.adaptCustomerData(data);

    adaptedCustomer.billingAddress = this.adaptShippingBillingAddress(
      data.billingAddressIds,
      adaptedCustomer.addresses,
    );
    adaptedCustomer.defaultBillingAddressId = this.adaptDefaultAddress(
      data.defaultBillingAddressId,
      adaptedCustomer.addresses,
    );
    adaptedCustomer.shippingAddress = this.adaptShippingBillingAddress(
      data.shippingAddressIds,
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
      return addressFound ?? null;
    }
    return null;
  }

  private adaptShippingBillingAddress(currentsAddress: string[] | undefined, allAddress: Address[]): Address[] {
    const result: Address[] = [];
    if (currentsAddress) {
      currentsAddress.forEach((addressId) => {
        const addressFound = allAddress.find((address) => address.id === addressId);
        if (addressFound) {
          result.push(addressFound);
        }
      });
    }
    return result;
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
    const data = await this.root.editPassword(customer, currentPassword, newPassword);
    return this.getCustomerFromData(data);
  }

  public getAnonymousId(): string {
    return this.anonymousId;
  }

  public async getCurrentUser(): Promise<User | null> {
    const data = await this.root.getCustomer();
    return this.getCustomerFromData(data);
  }

  public async hasEmail(email: string): Promise<User | null> {
    const data = await this.root.getCustomerByEmail(email);
    return this.getCustomerFromData(data);
  }

  public async logout(): Promise<boolean> {
    const result = await this.root.logoutUser();
    return result;
  }

  public async registerNewCustomer(userData: User): Promise<User | null> {
    const data = await this.root.registrationUser(userData);
    return this.getCustomerFromData(data);
  }

  public setAnonymousId(anonymousId: string): void {
    this.anonymousId = anonymousId;
  }
}

const createCustomerModel = (): CustomerModel => new CustomerModel();

const customerModel = createCustomerModel();

export default function getCustomerModel(): CustomerModel {
  return customerModel;
}
