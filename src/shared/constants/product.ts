export const PRICE_FRACTIONS = 100;
export const PRODUCT_LIMIT = 9;
export const DEFAULT_PAGE = 1;
export const MIN_PRICE = 0;
export const MAX_PRICE = 1000000;
export const CURRENCY = 'USD';

export const EMPTY_PRODUCT = {
  en: {
    EMPTY: 'No products found',
  },
  ru: {
    EMPTY: 'Ничего не найдено',
  },
} as const;

export const SEARCH_PARAMS_FIELD = {
  CATEGORY: 'category',
  DIRECTION: 'direction',
  FIELD: 'field',
  MAX_PRICE: 'price-max',
  META: 'meta',
  MIN_PRICE: 'price-min',
  PAGE: 'page',
  SEARCH: 'search',
  SIZE: 'size',
  SUBCATEGORY: 'subcategory',
} as const;

export const PRODUCT_INFO_TEXT = {
  en: {
    DIFFICULTY: 'Difficulty: ',
    FULL_DESCRIPTION: 'Full description:',
    SHORT_DESCRIPTION: 'Short description:',
    SIZE: 'Size:',
  },
  ru: {
    DIFFICULTY: 'Сложность: ',
    FULL_DESCRIPTION: 'Полное описание:',
    SHORT_DESCRIPTION: 'Краткое описание:',
    SIZE: 'Размер:',
  },
} as const;
