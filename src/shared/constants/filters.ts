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

export const META_FILTERS = {
  en: {
    ALL_PRODUCTS: 'All products',
    NEW_ARRIVALS: 'New Arrivals',
    SALE: 'Sale',
  },
  ru: {
    ALL_PRODUCTS: 'Все продукты',
    NEW_ARRIVALS: 'Новые поступления',
    SALE: 'Скидки',
  },
} as const;

export const META_FILTERS_KEY = {
  ALL_PRODUCTS: 'ALL_PRODUCTS',
  NEW_ARRIVALS: 'NEW_ARRIVALS',
  SALE: 'SALE',
};

export type MetaFiltersType = (typeof META_FILTERS_KEY)[keyof typeof META_FILTERS_KEY];

export const META_FILTERS_ID = {
  ALL_PRODUCTS: 'all-products',
  NEW_ARRIVALS: 'new-arrivals',
  SALE: 'sale',
} as const;
