export interface localization {
  language: string;
  value: string;
}

export interface Category {
  id: string;
  key: string;
  name: localization[];
}

export const SIZE = {
  L: 'L',
  M: 'M',
  S: 'S',
  XL: 'XL',
} as const;

export type Size = (typeof SIZE)[keyof typeof SIZE];

export interface Variant {
  discount: number;
  price: number;
  size: Size | null;
}

export interface Product {
  category: Category[];
  description: localization[];
  fullDescription: localization[];
  id: string;
  images: string[];
  key: string;
  name: localization[];
  variant: Variant[];
}
