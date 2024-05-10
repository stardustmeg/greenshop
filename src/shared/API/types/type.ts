import { type Category, type Size } from '@/shared/types/product.ts';

export const Attribute = {
  FULL_DESCRIPTION: 'full_description',
  SIZE: 'size',
} as const;

export const TokenType = {
  ANONYM: 'anonym',
  AUTH: 'auth',
} as const;

export type TokenTypeType = (typeof TokenType)[keyof typeof TokenType];

export const FilterFields = {
  CATEGORY: 'categories.id',
  NEW_ARRIVAL: 'variants.attributes.new_arrival:true',
  PRICE: 'variants.price.centAmount',
  SALE: 'variants.prices.discounted:exists',
  SIZE: 'variants.attributes.size.key',
} as const;

export type FilterFieldsType = (typeof FilterFields)[keyof typeof FilterFields];

const SortFields = {
  NAME: 'name',
  PRICE: 'price',
} as const;

type SortFieldsType = (typeof SortFields)[keyof typeof SortFields];

export const SortDirection = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

type SortDirectionType = (typeof SortDirection)[keyof typeof SortDirection];

export type SortOptions = {
  direction: SortDirectionType;
  field: SortFieldsType;
  locale?: string;
};

export type SearchOptions = {
  locale: string;
  value: string;
};

export type OptionsRequest = {
  filter?: string[];
  limit?: number;
  page?: number;
  search?: SearchOptions;
  sort?: SortOptions;
};

export type PriceRange = {
  max: number;
  min: number;
};

export type CategoriesProductCount = {
  category: Category;
  count: number;
};

export type SizeProductCount = {
  count: number;
  size: Size;
};
