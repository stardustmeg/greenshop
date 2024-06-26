export const PRICE_FRACTIONS = 100;
export const PRODUCT_LIMIT = 9;
export const DEFAULT_PAGE = 1;
export const MIN_PRICE = 0;
export const MAX_PRICE = '*';
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
  SLIDE: 'slide',
  SUBCATEGORY: 'subcategory',
} as const;

export const PRODUCT_INFO_TEXT = {
  en: {
    CATEGORY: 'Categories: ',
    DIFFICULTY: 'Difficulty: ',
    DISCOUNT_LABEL: 'OFF',
    FULL_DESCRIPTION: 'Full description:',
    SHORT_DESCRIPTION: 'Short description:',
    SIZE: 'Size:',
  },
  ru: {
    CATEGORY: 'Категории: ',
    DIFFICULTY: 'Сложность: ',
    DISCOUNT_LABEL: 'Скидка',
    FULL_DESCRIPTION: 'Полное описание:',
    SHORT_DESCRIPTION: 'Краткое описание:',
    SIZE: 'Размер:',
  },
} as const;

export const PRODUCT_INFO_TEXT_KEY = {
  CATEGORY: 'CATEGORY',
  DIFFICULTY: 'DIFFICULTY',
  DISCOUNT_LABEL: 'DISCOUNT_LABEL',
  FULL_DESCRIPTION: 'FULL_DESCRIPTION',
  SHORT_DESCRIPTION: 'SHORT_DESCRIPTION',
  SIZE: 'SIZE',
} as const;
