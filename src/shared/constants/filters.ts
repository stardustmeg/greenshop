export const TITLE = {
  en: {
    CATEGORY: 'Category',
    PRICE: 'Price',
    SIZE: 'Size',
  },
  ru: {
    CATEGORY: 'Категория',
    PRICE: 'Цена',
    SIZE: 'Размер',
  },
} as const;

export const PRICE_RANGE_LABEL = {
  en: {
    FROM: 'From',
    TO: 'To',
  },
  ru: {
    FROM: 'От',
    TO: 'До',
  },
} as const;

export const META_FILTER = {
  en: {
    ALL_PRODUCTS: 'all',
    NEW_ARRIVALS: 'new',
    SALE: 'sale',
  },
  ru: {
    ALL_PRODUCTS: 'Все',
    NEW_ARRIVALS: 'Новинки',
    SALE: 'Скидки',
  },
} as const;

const META_FILTER_KEY = {
  ALL_PRODUCTS: 'ALL_PRODUCTS',
  NEW_ARRIVALS: 'NEW_ARRIVALS',
  SALE: 'SALE',
};

export type MetaFilterKeyType = (typeof META_FILTER_KEY)[keyof typeof META_FILTER_KEY];

export const META_FILTER_ID = {
  ALL_PRODUCTS: 'all-products',
  NEW_ARRIVALS: 'new-arrivals',
  SALE: 'sale',
} as const;
