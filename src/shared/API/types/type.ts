import type { Category, Product, SizeType } from '@/shared/types/product.ts';

import type FilterProduct from '../product/utils/filter';

export const Attribute = {
  FULL_DESCRIPTION: 'full_description',
  LEVEL: 'level',
  SIZE: 'size',
} as const;

export const TokenType = {
  ANONYM: 'anonym',
  AUTH: 'auth',
} as const;

export type TokenTypeType = (typeof TokenType)[keyof typeof TokenType];

export const FilterFields = {
  CATEGORY: 'categories.id',
  ID: 'id',
  NEW_ARRIVAL: 'variants.attributes.new_arrival:true',
  PRICE: 'variants.price.centAmount',
  SALE: 'variants.prices.discounted:exists',
  SIZE: 'variants.attributes.size.key',
} as const;

export type FilterFieldsType = (typeof FilterFields)[keyof typeof FilterFields];

export const SortFields = {
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
  filter?: FilterProduct;
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
  size: SizeType;
};

export type ProductWithCount = {
  categoryCount: CategoriesProductCount[];
  priceRange: PriceRange;
  products: Product[];
  sizeCount: SizeProductCount[];
  total: number;
};
