import { PAGE_ID } from '../constants/pages.ts';

export const buildPathName = (
  endpoint: null | string,
  id: null | string = null,
  queryParams: { [key: string]: (null | string)[] } | null = null,
): string => {
  if (!queryParams) {
    return `${endpoint ? `${endpoint}` : ''}${id ? `/${id} ` : ''}`;
  }

  const queryString = Object.entries(queryParams)
    .filter(([, values]) => values.some(Boolean))
    .map(([key, values]) => `${key}=${values.filter(Boolean).join('_')}`)
    .join('&');

  return `${endpoint ? `${endpoint}` : ''}${id ? `/${id}` : ''}${queryString ? `${`?${queryString}`}` : ''}`;
};

export const buildMainPathName = buildPathName.bind(null, PAGE_ID.MAIN_PAGE);
export const buildCatalogPathName = buildPathName.bind(null, PAGE_ID.CATALOG_PAGE);
export const buildProductPathName = buildPathName.bind(null, PAGE_ID.PRODUCT_PAGE);
export const buildWishlistPathName = buildPathName.bind(null, PAGE_ID.WISHLIST_PAGE);
export const buildCartPathName = buildPathName.bind(null, PAGE_ID.CART_PAGE);
