import { type Category, type Size } from '@/shared/types/product.ts';

export const Attribute = {
  FULL_DESCRIPTION: 'full_description',
  SIZE: 'size',
};

export enum TokenType {
  ANONYM = 'anonym',
  AUTH = 'auth',
}

export enum FilterFields {
  CATEGORY = 'categories.id',
  NEW_ARRIVAL = 'variants.attributes.new_arrival:true',
  PRICE = 'variants.price.centAmount',
  SALE = 'variants.prices.discounted:exists',
  SIZE = 'variants.attributes.size.key',
}

export enum SortFields {
  NAME = 'name',
  PRICE = 'price',
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export type SortOptions = {
  direction: SortDirection;
  field: SortFields;
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
