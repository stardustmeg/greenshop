export const SORTING_TEXT: Record<string, Record<string, string>> = {
  en: {
    DEFAULT: 'Default',
    NAME: 'Name',
    PRICE: 'Price',
    SEARCH: 'Search...',
    SORT_BY: 'Sort by:',
  },
  ru: {
    DEFAULT: 'Умолчанию',
    NAME: 'Названию',
    PRICE: 'Цене',
    SEARCH: 'Поиск...',
    SORT_BY: 'По:',
  },
} as const;

export const SORTING_TEXT_KEY: Record<string, string> = {
  DEFAULT: 'DEFAULT',
  NAME: 'NAME',
  PRICE: 'PRICE',
  SEARCH: 'SEARCH',
  SORT_BY: 'SORT_BY',
} as const;

export const SORTING_ID = {
  DEFAULT: 'default',
  NAME: 'name',
  PRICE: 'price',
} as const;
