import type { ShoppingList, ShoppingListProduct } from '@/shared/types/shopping-list.ts';
import type {
  ClientResponse,
  MyShoppingListAddLineItemAction,
  MyShoppingListDraft,
  ShoppingListPagedQueryResponse,
  ShoppingList as ShoppingListResponse,
  ShoppingListSetAnonymousIdAction,
} from '@commercetools/platform-sdk';

import { DEFAULT_PAGE, PRODUCT_LIMIT } from '@/shared/constants/product.ts';

import type { OptionsRequest } from '../types/type.ts';

import makeSortRequest from '../product/utils/sort.ts';
import getApiClient, { type ApiClient } from '../sdk/client.ts';

export class ShoppingListApi {
  private client: ApiClient;

  constructor() {
    this.client = getApiClient();
  }

  public async addProduct(
    shoppingList: ShoppingList,
    actions: MyShoppingListAddLineItemAction[],
  ): Promise<ClientResponse> {
    const data = await this.client
      .apiRoot()
      .me()
      .shoppingLists()
      .withId({ ID: shoppingList.id })
      .post({
        body: {
          actions,
          version: shoppingList.version,
        },
      })
      .execute();
    return data;
  }

  public async create(): Promise<ClientResponse<ShoppingListResponse>> {
    const myShopList: MyShoppingListDraft = {
      deleteDaysAfterLastModification: 2,
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

  public async deleteShopList(shoppingList: ShoppingList): Promise<ClientResponse<ShoppingListResponse>> {
    const data = await this.client
      .apiRoot()
      .me()
      .shoppingLists()
      .withId({ ID: shoppingList.id })
      .delete({
        queryArgs: {
          version: shoppingList.version,
        },
      })
      .execute();
    return data;
  }

  public async get(options?: OptionsRequest): Promise<ClientResponse<ShoppingListPagedQueryResponse>> {
    const { limit = PRODUCT_LIMIT, page = DEFAULT_PAGE, sort } = options || {};
    const data = await this.client
      .apiRoot()
      .me()
      .shoppingLists()
      .get({
        queryArgs: {
          limit,
          offset: (page - 1) * PRODUCT_LIMIT,
          ...(sort && { sort: makeSortRequest(sort) }),
          withTotal: true,
        },
      })
      .execute();
    return data;
  }

  public async getAnonymList(ID: string, options?: OptionsRequest): Promise<ClientResponse<ShoppingListResponse>> {
    const { limit = PRODUCT_LIMIT, page = DEFAULT_PAGE, sort } = options || {};
    const data = await this.client
      .apiRoot()
      .shoppingLists()
      .withId({ ID })
      .get({
        queryArgs: {
          limit,
          offset: (page - 1) * PRODUCT_LIMIT,
          ...(sort && { sort: makeSortRequest(sort) }),
          withTotal: true,
        },
      })
      .execute();
    return data;
  }

  public async setAnonymousId(
    shoppingList: ShoppingList,
    actions: ShoppingListSetAnonymousIdAction,
  ): Promise<ClientResponse<ShoppingListResponse>> {
    const data = await this.client
      .apiRoot()
      .shoppingLists()
      .withId({ ID: shoppingList.id })
      .post({
        body: {
          actions: [actions],
          version: shoppingList.version,
        },
      })
      .execute();
    return data;
  }
}

const createShoppingListApi = (): ShoppingListApi => new ShoppingListApi();

const shoppingListApi = createShoppingListApi();

export default function getShoppingListApi(): ShoppingListApi {
  return shoppingListApi;
}
