import type { Cart } from '@/shared/types/cart.ts';
import type {
  CartPagedQueryResponse,
  Cart as CartResponse,
  CartSetAnonymousIdAction,
  ClientResponse,
  MyCartDraft,
  MyCartUpdateAction,
} from '@commercetools/platform-sdk';

import { CURRENCY } from '@/shared/constants/product.ts';

import getApiClient, { type ApiClient } from '../sdk/client.ts';

export default class CartApi {
  private client: ApiClient;

  constructor() {
    this.client = getApiClient();
  }

  public async create(): Promise<ClientResponse<CartResponse>> {
    const myCart: MyCartDraft = {
      currency: CURRENCY,
      deleteDaysAfterLastModification: 2,
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

  public async deleteCart(cart: Cart): Promise<ClientResponse> {
    const data = await this.client
      .apiRoot()
      .me()
      .carts()
      .withId({ ID: cart.id })
      .delete({
        queryArgs: {
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

  public async getAnonymCart(ID: string): Promise<ClientResponse<CartResponse>> {
    const data = await this.client.apiRoot().carts().withId({ ID }).get().execute();
    return data;
  }

  public async getCarts(): Promise<ClientResponse<CartPagedQueryResponse>> {
    const data = await this.client.apiRoot().me().carts().get().execute();
    return data;
  }

  public async setAnonymousId(cart: Cart, actions: CartSetAnonymousIdAction[]): Promise<ClientResponse> {
    const data = await this.client
      .apiRoot()
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

  public async updateCart(cart: Cart, actions: MyCartUpdateAction[]): Promise<ClientResponse<CartResponse>> {
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
}
