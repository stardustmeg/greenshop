import type { ButtonActionType } from './types.ts';

export interface ButtonAttributesInterface {
  action?: ButtonActionType;
  attrs?: Record<string, string>;
  classes?: string[];
  text?: string;
}

export interface PageInterface {
  getHTML(): HTMLDivElement;
}

export interface AddressInterface {
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

export interface UserInterface {
  addresses: AddressInterface[];
  defaultBillingAddressId: AddressInterface | null;
  defaultShippingAddressId: AddressInterface | null;
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  password: string;
  version: number;
}
