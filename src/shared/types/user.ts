import type { CartProduct } from './product';

export interface UserCredentials {
  email: string;
  password: string;
}

export interface PersonalData {
  email: string;
  firstName: string;
  lastName: string;
}

export interface User extends PersonalData, UserCredentials {
  addresses: Address[];
  birthDate: string;
  defaultBillingAddressId: Address | null;
  defaultShippingAddressId: Address | null;
  id: string;
  locale: string;
  version: number;
}

export interface FormAddress {
  city: string;
  country: string;
  postalCode: string;
  streetName: string;
}

export interface Address extends FormAddress, PersonalData {
  id: string;
  state: string;
  streetNumber: string;
}

export interface Cart {
  id: string;
  products: CartProduct[];
  version: number;
}
