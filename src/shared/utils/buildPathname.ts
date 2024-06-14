import { PAGE_ID } from '../constants/pages.ts';

type QueryParamsType = {
  [key: string]: (null | string)[];
};

type BuildQuery = (queryParams: QueryParamsType | null) => string;

type BuildPathWithID = (endpoint: null | string, id: null | string) => string;
type BuildPathWithQuery = (endpoint: null | string, queryParams: QueryParamsType | null) => string;
type BuildPathWithIDAndQuery = (
  endpoint: null | string,
  id: null | string,
  queryParams: QueryParamsType | null,
) => string;
type BuildPathWithIDAndQueryAndHash = (
  endpoint: null | string,
  id: null | string,
  queryParams: QueryParamsType | null,
  hash: null | string,
) => string;

export const buildPathWithID: BuildPathWithID = (endpoint, id = null) =>
  `${endpoint ? `${endpoint}` : ''}${id ? `/${id}` : ''}`;

export const buildQuery: BuildQuery = (queryParams) => {
  if (!queryParams) {
    return '';
  }

  const queryString = Object.entries(queryParams)
    .filter(([, values]) => values.some(Boolean))
    .map(([key, values]) => `${key}=${values.filter(Boolean).join('_')}`)
    .join('&');

  return queryString ? `?${queryString}` : '';
};

export const buildPathWithQuery: BuildPathWithQuery = (endpoint, queryParams = null) => {
  const queryPart = buildQuery(queryParams);
  return `${endpoint}${queryPart}`;
};

export const buildPathWithIDAndQuery: BuildPathWithIDAndQuery = (endpoint, id = null, queryParams = null) => {
  const pathWithID = buildPathWithID(endpoint, id);
  const queryPart = buildQuery(queryParams);
  return `${pathWithID}${queryPart}`;
};

export const buildPathWithIDAndQueryAndHash: BuildPathWithIDAndQueryAndHash = (
  endpoint,
  id = null,
  queryParams = null,
  hash = null,
) => {
  const pathWithIDAndQuery = buildPathWithIDAndQuery(endpoint, id, queryParams);
  const hashPart = hash ? `#${hash}` : '';
  return `${pathWithIDAndQuery}${hashPart}`;
};

export const mainPathWithID = buildPathWithID.bind(null, PAGE_ID.MAIN_PAGE);
export const catalogPathWithID = buildPathWithID.bind(null, PAGE_ID.CATALOG_PAGE);
export const productPathWithID = buildPathWithID.bind(null, PAGE_ID.PRODUCT_PAGE);
export const wishlistPathWithID = buildPathWithID.bind(null, PAGE_ID.WISHLIST_PAGE);
export const cartPathWithID = buildPathWithID.bind(null, PAGE_ID.CART_PAGE);
export const aboutUsPathWithID = buildPathWithID.bind(null, PAGE_ID.ABOUT_US_PAGE);

export const mainPathWithQuery = buildPathWithQuery.bind(null, PAGE_ID.MAIN_PAGE);
export const catalogPathWithQuery = buildPathWithQuery.bind(null, PAGE_ID.CATALOG_PAGE);
export const productPathWithQuery = buildPathWithQuery.bind(null, PAGE_ID.PRODUCT_PAGE);
export const wishlistPathWithQuery = buildPathWithQuery.bind(null, PAGE_ID.WISHLIST_PAGE);
export const cartPathWithQuery = buildPathWithQuery.bind(null, PAGE_ID.CART_PAGE);

export const mainPathWithIDAndQuery = buildPathWithIDAndQuery.bind(null, PAGE_ID.MAIN_PAGE);
export const catalogPathWithIDAndQuery = buildPathWithIDAndQuery.bind(null, PAGE_ID.CATALOG_PAGE);
export const productPathWithIDAndQuery = buildPathWithIDAndQuery.bind(null, PAGE_ID.PRODUCT_PAGE);
export const wishlistPathWithIDAndQuery = buildPathWithIDAndQuery.bind(null, PAGE_ID.WISHLIST_PAGE);
export const cartPathWithIDAndQuery = buildPathWithIDAndQuery.bind(null, PAGE_ID.CART_PAGE);

export const mainPathWithIDAndQueryAndHash = buildPathWithIDAndQueryAndHash.bind(null, PAGE_ID.MAIN_PAGE);
export const catalogPathWithIDAndQueryAndHash = buildPathWithIDAndQueryAndHash.bind(null, PAGE_ID.CATALOG_PAGE);
export const productPathWithIDAndQueryAndHash = buildPathWithIDAndQueryAndHash.bind(null, PAGE_ID.PRODUCT_PAGE);
export const wishlistPathWithIDAndQueryAndHash = buildPathWithIDAndQueryAndHash.bind(null, PAGE_ID.WISHLIST_PAGE);
export const cartPathWithIDAndQueryAndHash = buildPathWithIDAndQueryAndHash.bind(null, PAGE_ID.CART_PAGE);
