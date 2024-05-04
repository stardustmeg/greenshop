import type {
  AttributePlainEnumValue,
  CategoryPagedQueryResponse,
  ClientResponse,
  Customer,
  CustomerPagedQueryResponse,
  CustomerSignInResult,
  LocalizedString,
  Product,
  ProductPagedQueryResponse,
} from '@commercetools/platform-sdk';

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

export function isCustomerPagedQueryResponse(data: unknown): data is CustomerPagedQueryResponse {
  return Boolean(
    typeof data === 'object' &&
      data &&
      'count' in data &&
      typeof data.count === 'number' &&
      'limit' in data &&
      typeof data.limit === 'number' &&
      'results' in data &&
      typeof Array.isArray(data.results),
  );
}

export function isCategoryPagedQueryResponse(data: unknown): data is CategoryPagedQueryResponse {
  return Boolean(
    typeof data === 'object' &&
      data &&
      'count' in data &&
      typeof data.count === 'number' &&
      'limit' in data &&
      typeof data.limit === 'number' &&
      'results' in data &&
      typeof Array.isArray(data.results),
  );
}

export function isProductPagedQueryResponse(data: unknown): data is ProductPagedQueryResponse {
  return Boolean(
    typeof data === 'object' &&
      data &&
      'count' in data &&
      typeof data.count === 'number' &&
      'limit' in data &&
      typeof data.limit === 'number' &&
      'total' in data &&
      typeof data.total === 'number' &&
      'results' in data &&
      typeof Array.isArray(data.results),
  );
}

export function isLocalizationObj(data: unknown): data is LocalizedString {
  return Boolean(typeof data === 'object' && data && Object.keys(data).every((key) => typeof key === 'string'));
}

export function isAttributePlainEnumValue(data: unknown): data is AttributePlainEnumValue {
  return Boolean(
    typeof data === 'object' &&
      data &&
      'key' in data &&
      typeof data.key === 'string' &&
      'label' in data &&
      typeof data.label === 'string',
  );
}

export function isProductResponse(data: unknown): data is Product {
  return Boolean(
    typeof data === 'object' &&
      data &&
      'id' in data &&
      typeof data.id === 'string' &&
      'key' in data &&
      typeof data.id === 'string' &&
      'masterData' in data &&
      typeof data.masterData === 'object' &&
      data.masterData !== null &&
      'staged' in data.masterData &&
      typeof data.masterData.staged === 'object' &&
      data.masterData.staged !== null &&
      'categories' in data.masterData.staged &&
      'description' in data.masterData.staged &&
      'name' in data.masterData.staged &&
      'variants' in data.masterData.staged,
  );
}
