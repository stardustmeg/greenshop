export interface localization {
  language: string;
  value: string;
}

export interface Category {
  id: string;
  key: string;
  name: localization[];
  parent: Category | null;
  slug: localization[];
}

export const SIZE = {
  L: 'L',
  M: 'M',
  S: 'S',
  XL: 'XL',
} as const;

export type SizeType = (typeof SIZE)[keyof typeof SIZE];

export interface Variant {
  discount: number;
  id: number;
  price: number;
  size: SizeType | null;
}

export interface Product extends ProductInfo {
  category: Category[];
  id: string;
  slug: localization[];
}

interface ProductInfo {
  description: localization[];
  fullDescription: localization[];
  images: string[];
  key: string;
  name: localization[];
  variant: Variant[];
}

export interface ProductInfoParams extends ProductInfo {
  category: Category | null;
  currentSize: null | string;
  subcategory: Category | null;
}
