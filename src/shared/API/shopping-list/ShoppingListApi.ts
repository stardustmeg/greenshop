import type { ShoppingList, ShoppingListProduct } from '@/shared/types/shopping-list.ts';
import type {
  ClientResponse,
  MyShoppingListDraft,
  ShoppingListPagedQueryResponse,
  ShoppingList as ShoppingListResponse,
} from '@commercetools/platform-sdk';

import getApiClient, { type ApiClient } from '../sdk/client.ts';

export class ShoppingListApi {
  private client: ApiClient;

  constructor() {
    this.client = getApiClient();
  }

  public async addProduct(shoppingList: ShoppingList, productId: string): Promise<ClientResponse> {
    const data = await this.client
      .apiRoot()
      .me()
      .shoppingLists()
      .withId({ ID: shoppingList.id })
      .post({
        body: {
          actions: [
            {
              action: 'addLineItem',
              productId,
            },
          ],
          version: shoppingList.version,
        },
      })
      .execute();
    return data;
  }

  public async create(): Promise<ClientResponse<ShoppingListResponse>> {
    const myShopList: MyShoppingListDraft = {
      name: {
        en: 'Favorite',
        ru: 'Favorite',
      },
    };
    const newCart = await this.client
      .apiRoot()
      .me()
      .shoppingLists()
      .post({
        body: myShopList,
      })
      .execute();

    return newCart;
  }

  public async deleteProduct(shoppingList: ShoppingList, product: ShoppingListProduct): Promise<ClientResponse> {
    const data = await this.client
      .apiRoot()
      .me()
      .shoppingLists()
      .withId({ ID: shoppingList.id })
      .post({
        body: {
          actions: [
            {
              action: 'removeLineItem',
              lineItemId: product.lineItemId,
            },
          ],
          version: shoppingList.version,
        },
      })
      .execute();
    return data;
  }

  public async get(): Promise<ClientResponse<ShoppingListPagedQueryResponse>> {
    const data = await this.client.apiRoot().me().shoppingLists().get().execute();
    return data;
  }
}

const createShoppingListApi = (): ShoppingListApi => new ShoppingListApi();

const shoppingListApi = createShoppingListApi();

export default function getShoppingListApi(): ShoppingListApi {
  return shoppingListApi;
}
