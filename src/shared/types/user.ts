export interface UserCredentials {
  email: string;
  password: string;
}

export interface AuthCredentials extends UserCredentials {
  anonymousCartId?: string;
  anonymousCartSignInMode?: string;
  anonymousId?: string;
  updateProductData?: boolean;
}

interface UserName {
  firstName: string;
  lastName: string;
}

export interface PersonalData extends UserName {
  email: string;
}

export interface PersonalInfo extends UserName {
  birthDate: string;
}

export interface User extends PersonalData, UserCredentials {
  addresses: Address[];
  billingAddress: Address[];
  birthDate: string;
  defaultBillingAddressId: Address | null;
  defaultShippingAddressId: Address | null;
  id: string;
  locale: string;
  shippingAddress: Address[];
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
