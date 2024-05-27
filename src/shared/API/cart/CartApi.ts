import type { AddCartItem, Cart, CartProduct, EditCartItem } from '@/shared/types/cart.ts';
import type {
  CartPagedQueryResponse,
  Cart as CartResponse,
  ClientResponse,
  MyCartDraft,
  MyCartUpdateAction,
} from '@commercetools/platform-sdk';

import { CURRENCY } from '@/shared/constants/product.ts';

import getApiClient, { type ApiClient } from '../sdk/client.ts';

export class CartApi {
  private client: ApiClient;

  constructor() {
    this.client = getApiClient();
  }

  public async addProduct(cart: Cart, addCartItem: AddCartItem): Promise<ClientResponse> {
    const data = await this.client
      .apiRoot()
      .me()
      .carts()
      .withId({ ID: cart.id })
      .post({
        body: {
          actions: [
            {
              action: 'addLineItem',
              productId: addCartItem.productId,
              quantity: addCartItem.quantity,
              variantId: addCartItem.variantId,
            },
          ],
          version: cart.version,
        },
      })
      .execute();
    return data;
  }

  public async clearCart(cart: Cart, actions: MyCartUpdateAction[]): Promise<ClientResponse<CartResponse>> {
    const data = await this.client
      .apiRoot()
      .me()
      .carts()
      .withId({ ID: cart.id })
      .post({
        body: {
          actions,
          version: cart.version,
        },
      })
      .execute();
    return data;
  }

  public async create(): Promise<ClientResponse<CartResponse>> {
    const myCart: MyCartDraft = {
      currency: CURRENCY,
    };
    const newCart = await this.client
      .apiRoot()
      .me()
      .carts()
      .post({
        body: myCart,
      })
      .execute();

    return newCart;
  }

  public async deleteProduct(cart: Cart, product: CartProduct): Promise<ClientResponse> {
    const data = await this.client
      .apiRoot()
      .me()
      .carts()
      .withId({ ID: cart.id })
      .post({
        body: {
          actions: [
            {
              action: 'removeLineItem',
              lineItemId: product.lineItemId,
            },
          ],
          version: cart.version,
        },
      })
      .execute();
    return data;
  }

  public async editProductCount(cart: Cart, editCartItem: EditCartItem): Promise<ClientResponse> {
    const data = await this.client
      .apiRoot()
      .me()
      .carts()
      .withId({ ID: cart.id })
      .post({
        body: {
          actions: [
            {
              action: 'changeLineItemQuantity',
              lineItemId: editCartItem.lineId,
              quantity: editCartItem.quantity,
            },
          ],
          version: cart.version,
        },
      })
      .execute();
    return data;
  }

  public async getActiveCart(): Promise<ClientResponse<CartResponse>> {
    const data = await this.client.apiRoot().me().activeCart().get().execute();
    return data;
  }

  public async getCarts(): Promise<ClientResponse<CartPagedQueryResponse>> {
    const data = await this.client.apiRoot().me().carts().get().execute();
    return data;
  }
}

const createCartApi = (): CartApi => new CartApi();

const cartApi = createCartApi();

export default function getCartApi(): CartApi {
  return cartApi;
}
