export interface localization {
  language: string;
  value: string;
}

export interface Category {
  id: string;
  key: string;
  name: localization[];
}

export enum Size {
  L = 'L',
  M = 'M',
  S = 'S',
  XL = 'XL',
}

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
