import type { Address, FormAddress, User, UserLoginData } from '../user';

export const isUserLoginData = (data: unknown): data is UserLoginData =>
  typeof data === 'object' &&
  data !== null &&
  'email' in data &&
  'password' in data &&
  typeof data.email === 'string' &&
  typeof data.password === 'string';

export const isFormAddress = (data: unknown): data is FormAddress =>
  typeof data === 'object' &&
  data !== null &&
  'city' in data &&
  'country' in data &&
  'postalCode' in data &&
  'streetName' in data &&
  typeof data.city === 'string' &&
  typeof data.country === 'string' &&
  typeof data.postalCode === 'string' &&
  typeof data.streetName === 'string';

export const isAddress = (data: unknown): data is Address =>
  typeof data === 'object' &&
  data !== null &&
  'city' in data &&
  'country' in data &&
  'postalCode' in data &&
  'streetName' in data &&
  'email' in data &&
  'firstName' in data &&
  'id' in data &&
  'lastName' in data &&
  'state' in data &&
  'streetNumber' in data &&
  typeof data.city === 'string' &&
  typeof data.country === 'string' &&
  typeof data.postalCode === 'string' &&
  typeof data.streetName === 'string' &&
  typeof data.email === 'string' &&
  typeof data.firstName === 'string' &&
  typeof data.id === 'string' &&
  typeof data.lastName === 'string' &&
  typeof data.state === 'string' &&
  typeof data.streetNumber === 'string';

export const isUser = (data: unknown): data is User =>
  typeof data === 'object' &&
  data !== null &&
  'addresses' in data &&
  'birthDate' in data &&
  'defaultBillingAddressId' in data &&
  'defaultShippingAddressId' in data &&
  'email' in data &&
  'firstName' in data &&
  'id' in data &&
  'lastName' in data &&
  'locale' in data &&
  'password' in data &&
  'version' in data &&
  Array.isArray(data.addresses) &&
  data.addresses.every((address) => isAddress(address)) &&
  typeof data.birthDate === 'string' &&
  (isAddress(data.defaultBillingAddressId) || data.defaultBillingAddressId === null) &&
  (isAddress(data.defaultShippingAddressId) || data.defaultBillingAddressId === null) &&
  typeof data.email === 'string' &&
  typeof data.firstName === 'string' &&
  typeof data.id === 'string' &&
  typeof data.lastName === 'string' &&
  typeof data.locale === 'string' &&
  typeof data.password === 'string' &&
  typeof data.version === 'number';
