import type { AddCartItem } from '@/shared/types/product.ts';
import type { Cart, CartPagedQueryResponse, ClientResponse, MyCartDraft } from '@commercetools/platform-sdk';

import getApiClient, { type ApiClient } from '../sdk/client.ts';

export class CartApi {
  private client: ApiClient;

  constructor() {
    this.client = getApiClient();
  }

  public async addProductToCart(addCartItem: AddCartItem): Promise<ClientResponse> {
    const data = await this.client
      .apiRoot()
      .me()
      .carts()
      .withId({ ID: addCartItem.cart.id })
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
          version: addCartItem.cart.version,
        },
      })
      .execute();
    return data;
  }

  public async createCarts(): Promise<ClientResponse<Cart>> {
    const myCart: MyCartDraft = {
      currency: 'USD',
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
