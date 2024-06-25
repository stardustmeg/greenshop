import type { Cart } from './cart';

export enum ChannelMessage {
  ADD_DISCOUNT = 'ADD_DISCOUNT',
  ADD_PRODUCT = 'ADD_PRODUCT',
  CLEAR_CART = 'CLEAR_CART',
  DELETE_COUPON = 'DELETE_COUPON',
  ITEM_CHANGE = 'ITEM_CHANGE',
}

export interface ChannelMessageType {
  cart: Cart;
  type: ChannelMessage;
}
