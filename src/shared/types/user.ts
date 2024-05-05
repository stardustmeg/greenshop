export interface UserLoginData {
  email: string;
  password: string;
}

export interface User {
  addresses: Address[];
  birthDate: string;
  defaultBillingAddressId: Address | null;
  defaultShippingAddressId: Address | null;
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  locale: string;
  password: string;
  version: number;
}

export interface FormAddress {
  city: string;
  country: string;
  postalCode: string;
  streetName: string;
}

export interface Address extends FormAddress {
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  state: string;
  streetNumber: string;
}
