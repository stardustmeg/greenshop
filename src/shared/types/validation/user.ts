import type { FormAddress, UserLoginData } from '../user';

export const isUserLoginData = (data: unknown): data is UserLoginData =>
  typeof data === 'object' &&
  data !== null &&
  'email' in data &&
  typeof data.email === 'string' &&
  'password' in data &&
  typeof data.password === 'string';

export const isFormAddress = (data: unknown): data is FormAddress =>
  typeof data === 'object' &&
  data !== null &&
  'city' in data &&
  typeof data.city === 'string' &&
  'country' in data &&
  typeof data.country === 'string' &&
  'postalCode' in data &&
  typeof data.postalCode === 'string' &&
  'streetName' in data &&
  typeof data.streetName === 'string';
