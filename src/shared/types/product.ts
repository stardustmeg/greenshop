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

export const LEVEL = {
  1: '1',
  2: '2',
  3: '3',
} as const;

export type LevelType = (typeof LEVEL)[keyof typeof LEVEL];

export const DIFFICULTY = {
  en: {
    1: 'Almost unkillable',
    2: 'Needs some love',
    3: 'For botanical ninjas',
  },
  ru: {
    1: 'Почти неубиваемое',
    2: 'Нужно немножко любви',
    3: 'Для ниндзя ботаников',
  },
} as const;

export interface Variant {
  discount: number;
  id: number;
  price: number;
  size: SizeType | null;
}

export interface Product {
  category: Category[];
  description: localization[];
  fullDescription: localization[];
  id: string;
  images: string[];
  key: string;
  level: LevelType | null;
  name: localization[];
  slug: localization[];
  variant: Variant[];
}

export interface ProductInfoParams extends Product {
  currentSize: null | string;
}
