import type { ShoppingList, ShoppingListProduct } from '@/shared/types/shopping-list.ts';
import type {
  ClientResponse,
  ShoppingListLineItem,
  ShoppingListPagedQueryResponse,
  ShoppingList as ShoppingListResponse,
} from '@commercetools/platform-sdk';

import getStore from '@/shared/Store/Store.ts';
import { setAnonymousId } from '@/shared/Store/actions.ts';

import { isClientResponse, isShoppingList, isShoppingListPagedQueryResponse } from '../../types/validation.ts';
import getShoppingListApi, { type ShoppingListApi } from '../ShoppingListApi.ts';

export class ShoppingListModel {
  private root: ShoppingListApi;

  private shoppingList: ShoppingList | null = null;

  constructor() {
    this.root = getShoppingListApi();
  }

  private adaptLineItem(product: ShoppingListLineItem): ShoppingListProduct {
    const result: ShoppingListProduct = {
      lineItemId: product.id,
      productId: product.productId || '',
    };
    return result;
  }

  private adaptShopList(data: ShoppingListResponse): ShoppingList {
    if (data.anonymousId) {
      getStore().dispatch(setAnonymousId(data.anonymousId));
    }
    return {
      id: data.id,
      products: data.lineItems.map((lineItem) => this.adaptLineItem(lineItem)),
      version: data.version,
    };
  }

  private getShopListFromData(
    data: ClientResponse<ShoppingListPagedQueryResponse | ShoppingListResponse>,
  ): ShoppingList {
    let cart: ShoppingList = {
      id: '',
      products: [],
      version: 0,
    };
    if (isClientResponse(data) && isShoppingList(data.body)) {
      cart = this.adaptShopList(data.body);
    } else if (isClientResponse(data) && isShoppingListPagedQueryResponse(data.body) && data.body.results.length) {
      cart = this.adaptShopList(data.body.results[0]);
    }
    return cart;
  }

  public async addProduct(productId: string): Promise<ShoppingList> {
    if (!this.shoppingList) {
      this.shoppingList = await this.getShoppingList();
    }
    const data = await this.root.addProduct(this.shoppingList, productId);
    this.shoppingList = this.getShopListFromData(data);
    return this.shoppingList;
  }

  public async create(): Promise<ShoppingList> {
    const newShoppingList = await this.root.create();
    this.shoppingList = this.getShopListFromData(newShoppingList);
    return this.shoppingList;
  }

  public async deleteProduct(products: ShoppingListProduct): Promise<ShoppingList> {
    if (!this.shoppingList) {
      this.shoppingList = await this.getShoppingList();
    }
    const data = await this.root.deleteProduct(this.shoppingList, products);
    this.shoppingList = this.getShopListFromData(data);

    return this.shoppingList;
  }

  public async getShoppingList(): Promise<ShoppingList> {
    if (!this.shoppingList) {
      const data = await this.root.get();
      if (data.body.count === 0) {
        const newShopList = await this.root.create();
        this.shoppingList = this.getShopListFromData(newShopList);
      } else {
        this.shoppingList = this.getShopListFromData(data);
      }
    }
    return this.shoppingList;
  }
}

const createShoppingListModel = (): ShoppingListModel => new ShoppingListModel();

const shoppingListModel = createShoppingListModel();

export default function getShoppingListModel(): ShoppingListModel {
  return shoppingListModel;
}
