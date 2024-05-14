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
  images: string;
  key: string;
  lineItemId: string;
  name: localization[];
  price: number;
  productId: string;
  quantity: number;
  totalPrice: number;
}

export interface AddCartItem {
  cart: Cart;
  productId: string;
  quantity: number;
  variantId: number;
}

export interface DeleteCartItem {
  cart: Cart;
  product: CartProduct;
}
