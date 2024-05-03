export interface UserLoginData {
  email: string;
  password: string;
}

export interface UserRegisterData extends UserLoginData {
  address: string;
  birthDate: number;
  city: string;
  country: string;
  firstName: string;
  lastName: string;
  postalCode: string;
}

export interface User {
  addresses: Address[];
  defaultBillingAddressId: Address | null;
  defaultShippingAddressId: Address | null;
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  password: string;
  version: number;
}

export interface Address {
  city: string;
  country: string;
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  postalCode: string;
  state: string;
  streetName: string;
  streetNumber: string;
}
