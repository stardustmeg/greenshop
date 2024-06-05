import type { SizeType, localization } from './product.ts';

export interface Cart {
  anonymousId: null | string;
  discounts: number;
  id: string;
  products: CartProduct[];
  total: number;
  version: number;
}

export interface CartProduct {
  images: string;
  key: string;
  lineItemId: string;
  name: localization[];
  price: number;
  productId: string;
  quantity: number;
  size: SizeType | null;
  totalPrice: number;
}

export interface AddCartItem {
  name: string;
  productId: string;
  quantity: number;
  variantId: number;
}

export interface EditCartItem {
  lineId: string;
  quantity: number;
}

export enum CartActive {
  DELETE = 'delete',
  MINUS = 'minus',
  PLUS = 'plus',
}
