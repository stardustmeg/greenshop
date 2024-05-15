import type { localization } from './product.ts';

export interface Cart {
  id: string;
  products: CartProduct[];
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
  totalPrice: number;
}

export interface AddCartItem {
  productId: string;
  quantity: number;
  variantId: number;
}

export interface EditCartItem {
  lineId: string;
  quantity: number;
}
