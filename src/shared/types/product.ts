import type { Cart } from './user';

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

export type SizeType = (typeof SIZE)[keyof typeof SIZE];

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
  name: localization[];
  variant: Variant[];
}

export interface CartProduct {
  // category: Category[];
  // description: localization[];
  // fullDescription: localization[];
  id: string;
  images: string;
  key: string;
  name: localization[];
  price: number;

  quantity: number;
  totalPrice: number;
  // variant: Variant;
}

export interface AddCartItem {
  cart: Cart;
  productId: string;
  quantity: number;
  variantId: number;
}
