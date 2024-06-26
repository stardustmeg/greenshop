import type { ChannelMessageType } from '@/shared/types/channel';
import type {
  AttributePlainEnumValue,
  Cart,
  CartPagedQueryResponse,
  CategoryPagedQueryResponse,
  ClientResponse,
  Customer,
  CustomerPagedQueryResponse,
  CustomerSignInResult,
  DiscountCodePagedQueryResponse,
  ErrorResponse,
  FacetRange,
  FacetTerm,
  LocalizedString,
  ProductDiscountPagedQueryResponse,
  ProductPagedQueryResponse,
  ProductProjection,
  ProductProjectionPagedQueryResponse,
  RangeFacetResult,
  ShoppingList,
  ShoppingListPagedQueryResponse,
  TermFacetResult,
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

export function isProductProjectionPagedSearchResponse(data: unknown): data is ProductPagedQueryResponse {
  return Boolean(typeof data === 'object' && data && 'facets' in data && typeof data.facets === 'object');
}

export function isProductProjectionPagedQueryResponse(data: unknown): data is ProductProjectionPagedQueryResponse {
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
      Array.isArray(data.results),
  );
}

export function isProductProjection(data: unknown): data is ProductProjection {
  return Boolean(
    typeof data === 'object' &&
      data &&
      'categories' in data &&
      'description' in data &&
      'name' in data &&
      'key' in data,
  );
}

export function isRangeFacetResult(data: unknown): data is RangeFacetResult {
  return Boolean(
    typeof data === 'object' && data && 'ranges' in data && Array.isArray(data.ranges) && data.ranges.length,
  );
}

export function isFacetRange(data: unknown): data is FacetRange {
  return Boolean(
    typeof data === 'object' &&
      data &&
      'min' in data &&
      typeof data.min === 'number' &&
      'max' in data &&
      typeof data.max === 'number',
  );
}

export function isTermFacetResult(data: unknown): data is TermFacetResult {
  return Boolean(
    typeof data === 'object' &&
      data &&
      'type' in data &&
      typeof data.type === 'string' &&
      data.type === 'terms' &&
      'terms' in data &&
      Array.isArray(data.terms) &&
      data.terms.length,
  );
}

export function isFacetTerm(data: unknown): data is FacetTerm {
  return Boolean(
    typeof data === 'object' &&
      data &&
      'term' in data &&
      typeof data.term === 'string' &&
      ('count' in data || 'productCount' in data),
  );
}

export function isErrorResponse(data: unknown): data is ErrorResponse {
  return Boolean(
    typeof data === 'object' &&
      data &&
      'statusCode' in data &&
      typeof data.statusCode === 'number' &&
      data.statusCode >= 400 &&
      'message' in data &&
      typeof data.message === 'string',
  );
}

export function isCart(data: unknown): data is Cart {
  return Boolean(
    typeof data === 'object' &&
      data &&
      'id' in data &&
      typeof data.id === 'string' &&
      'cartState' in data &&
      typeof data.cartState === 'string' &&
      'lineItems' in data &&
      Array.isArray(data.lineItems),
  );
}

export function isCartPagedQueryResponse(data: unknown): data is CartPagedQueryResponse {
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
      Array.isArray(data.results),
  );
}

export function isShoppingList(data: unknown): data is ShoppingList {
  return Boolean(
    typeof data === 'object' &&
      data &&
      'id' in data &&
      typeof data.id === 'string' &&
      'name' in data &&
      typeof data.name === 'object' &&
      'lineItems' in data &&
      Array.isArray(data.lineItems),
  );
}

export function isShoppingListPagedQueryResponse(data: unknown): data is ShoppingListPagedQueryResponse {
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
      Array.isArray(data.results),
  );
}

export function isDiscountCodePagedQueryResponse(data: unknown): data is DiscountCodePagedQueryResponse {
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
      Array.isArray(data.results),
  );
}

export function isProductDiscountPagedQueryResponse(data: unknown): data is ProductDiscountPagedQueryResponse {
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
      Array.isArray(data.results),
  );
}

export function isChannelMessage(data: unknown): data is ChannelMessageType {
  return Boolean(
    typeof data === 'object' &&
      data &&
      'type' in data &&
      typeof data.type === 'string' &&
      'cart' in data &&
      data.cart !== undefined,
  );
}
