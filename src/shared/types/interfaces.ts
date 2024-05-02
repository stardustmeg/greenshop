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

export interface InputParams {
  autocomplete: 'off' | 'on';
  id: string;
  lang?: string;
  placeholder: null | string;
  type: 'color' | 'date' | 'email' | 'number' | 'password' | 'search' | 'tel' | 'text';
}

export interface LabelParams {
  for: string;
  text: null | string;
}

export interface InputFieldParams {
  inputParams: InputParams;
  labelParams?: LabelParams | null;
}

export interface InputFieldValidatorParams {
  key: string;
  maxLength?: null | number;
  minLength?: null | number;
  notSpecialSymbols?: {
    message: string;
    pattern: RegExp;
  } | null;
  notWhitespace?: {
    message: string;
    pattern: RegExp;
  } | null;
  required?: boolean | null;
  requiredSymbols?: {
    message: string;
    pattern: RegExp;
  } | null;
  validBirthday?: {
    maxAge: number;
    message: string;
    minAge: number;
    pattern: RegExp;
  } | null;
  validCountry?: boolean;
  validMail?: {
    message: string;
    pattern: RegExp;
  } | null;
  validPostalCode?: boolean;
}
