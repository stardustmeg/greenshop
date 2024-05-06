import { type Category } from '@/shared/types/product.ts';

export const Attribute = {
  FULL_DESCRIPTION: 'full_description',
  SIZE: 'size',
};

export enum SortFields {
  NAME = 'masterData.staged.name',
  PRICE = 'masterData.staged.variants.price.value',
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

export type OptionsRequest = {
  limit?: number;
  page?: number;
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
