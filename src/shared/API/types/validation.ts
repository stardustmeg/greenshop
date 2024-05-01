import { type ClientResponse, type Customer, type CustomerSignInResult } from '@commercetools/platform-sdk';

export function isClientResponse(data: unknown): data is ClientResponse {
  return Boolean(
    typeof data === 'object' &&
      data &&
      'body' in data &&
      typeof data.body === 'object' &&
      'statusCode' in data &&
      data.statusCode !== 'undefined',
  );
}

export function isCustomerSignInResultResponse(data: unknown): data is CustomerSignInResult {
  return Boolean(typeof data === 'object' && data && 'customer' in data && typeof data.customer === 'object');
}

export function isCustomerResponse(data: unknown): data is Customer {
  return Boolean(
    typeof data === 'object' &&
      data &&
      'firstName' in data &&
      typeof data.firstName === 'string' &&
      'lastName' in data &&
      typeof data.lastName === 'string' &&
      'id' in data &&
      typeof data.id === 'string' &&
      'email' in data &&
      typeof data.email === 'string',
  );
}
