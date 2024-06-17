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

const buildPathWithID: BuildPathWithID = (endpoint, id = null) =>
  `${endpoint ? `${endpoint}` : ''}${id ? `/${id}` : ''}`;

const buildQuery: BuildQuery = (queryParams) => {
  if (!queryParams) {
    return '';
  }

  const queryString = Object.entries(queryParams)
    .filter(([, values]) => values.some(Boolean))
    .map(([key, values]) => `${key}=${values.filter(Boolean).join('_')}`)
    .join('&');

  return queryString ? `?${queryString}` : '';
};

const buildPathWithQuery: BuildPathWithQuery = (endpoint, queryParams = null) => {
  const queryPart = buildQuery(queryParams);
  return `${endpoint}${queryPart}`;
};

const buildPathWithIDAndQuery: BuildPathWithIDAndQuery = (endpoint, id = null, queryParams = null) => {
  const pathWithID = buildPathWithID(endpoint, id);
  const queryPart = buildQuery(queryParams);
  return `${pathWithID}${queryPart}`;
};

export const aboutUsPathWithID = buildPathWithID.bind(null, PAGE_ID.ABOUT_US_PAGE);

export const catalogPathWithQuery = buildPathWithQuery.bind(null, PAGE_ID.CATALOG_PAGE);

export const catalogPathWithIDAndQuery = buildPathWithIDAndQuery.bind(null, PAGE_ID.CATALOG_PAGE);
export const productPathWithIDAndQuery = buildPathWithIDAndQuery.bind(null, PAGE_ID.PRODUCT_PAGE);
export const wishlistPathWithIDAndQuery = buildPathWithIDAndQuery.bind(null, PAGE_ID.WISHLIST_PAGE);
