import type { ShoppingList, ShoppingListProduct } from '@/shared/types/shopping-list.ts';
import type {
  ClientResponse,
  MyShoppingListAddLineItemAction,
  ShoppingListLineItem,
  ShoppingListPagedQueryResponse,
  ShoppingList as ShoppingListResponse,
  ShoppingListSetAnonymousIdAction,
} from '@commercetools/platform-sdk';

import getStore from '@/shared/Store/Store.ts';
import { setAnonymousId, setAnonymousShopListId } from '@/shared/Store/actions.ts';
import { showErrorMessage } from '@/shared/utils/userMessage.ts';

import {
  isClientResponse,
  isErrorResponse,
  isShoppingList,
  isShoppingListPagedQueryResponse,
} from '../../types/validation.ts';
import ShoppingListApi from '../ShoppingListApi.ts';

enum ACTIONS {
  addLineItem = 'addLineItem',
  setAnonymousId = 'setAnonymousId',
}

type ShoppingListChangeHandler = (shoppingList: ShoppingList) => void;

export class ShoppingListModel {
  private root: ShoppingListApi;

  private shoppingList: ShoppingList | null = null;

  private subscribers: ShoppingListChangeHandler[] = [];

  constructor() {
    this.root = new ShoppingListApi();
    this.getShoppingList()
      .then((shopList: ShoppingList) => {
        const { anonymousId } = getStore().getState();
        if (anonymousId && shopList.anonymousId !== anonymousId) {
          this.updateListCustomer(shopList, anonymousId).catch(showErrorMessage);
        }
      })
      .catch(showErrorMessage);
  }

  private adaptLineItem(product: ShoppingListLineItem): ShoppingListProduct {
    const result: ShoppingListProduct = {
      lineItemId: product.id,
      productId: product.productId || '',
    };
    return result;
  }

  private adaptShopList(data: ShoppingListResponse): ShoppingList {
    const { anonymousId, authToken } = getStore().getState();
    if (data.anonymousId && !authToken) {
      getStore().dispatch(setAnonymousShopListId(data.id));
    }
    if (data.anonymousId && !authToken && !anonymousId) {
      getStore().dispatch(setAnonymousId(data.anonymousId));
    }
    return {
      anonymousId: data.anonymousId || null,
      id: data.id,
      products: data.lineItems.map((lineItem) => this.adaptLineItem(lineItem)),
      version: data.version,
    };
  }

  private async getAnonymousShoppingList(anonymousShopListId: string): Promise<ShoppingList | null> {
    const dataAnonymList = await this.root.getAnonymList(anonymousShopListId);

    if (!dataAnonymList.body.customer?.id) {
      const anonymShoppingList = this.getShopListFromData(dataAnonymList);
      this.notifySubscribers(anonymShoppingList);
      return anonymShoppingList;
    }
    return null;
  }

  private getShopListFromData(
    data: ClientResponse<ShoppingListPagedQueryResponse | ShoppingListResponse> | ShoppingListResponse,
  ): ShoppingList {
    let cart: ShoppingList = {
      anonymousId: null,
      id: '',
      products: [],
      version: 0,
    };
    if (isClientResponse(data) && isShoppingList(data.body)) {
      cart = this.adaptShopList(data.body);
    } else if (isClientResponse(data) && isShoppingListPagedQueryResponse(data.body) && data.body.results.length) {
      cart = this.adaptShopList(data.body.results[0]);
    } else if (isShoppingList(data)) {
      cart = this.adaptShopList(data);
    }
    return cart;
  }

  private async getUserShoppingLists(): Promise<ShoppingList> {
    const data = await this.root.get();
    if (data.body.count === 0) {
      const newShopList = await this.root.create();
      return this.getShopListFromData(newShopList);
    }
    if (data.body.count > 1) {
      const mergeShopLists = await this.mergeShopLists(data);
      return mergeShopLists;
    }

    const result = this.getShopListFromData(data);
    this.notifySubscribers(result);
    return result;
  }

  private async mergeShopLists(data: ClientResponse<ShoppingListPagedQueryResponse>): Promise<ShoppingList> {
    const products: string[] = [];
    const shopListId: ShoppingList[] = [];
    data.body.results.forEach((el) => {
      if (el.lineItems.length) {
        products.push(...el.lineItems.map((item) => item.productId));
      }
      shopListId.push(this.getShopListFromData(el));
    });
    const otherProducts = products.filter(
      (product) => !data.body.results[0].lineItems.some((lineItem) => lineItem.productId === product),
    );
    const otherShopLists = shopListId.filter((el) => data.body.results[0].id !== el.id);
    const shopList = this.getShopListFromData(data);
    const uniqProducts = Array.from(new Set(otherProducts));
    const actions: MyShoppingListAddLineItemAction[] = uniqProducts.map((lineItem) => ({
      action: ACTIONS.addLineItem,
      productId: lineItem,
    }));
    const lastShopList = await this.root.addProduct(shopList, actions);
    if (!isErrorResponse(lastShopList)) {
      await Promise.all(otherShopLists.map((id) => this.root.deleteShopList(id)));
    }
    const result = this.getShopListFromData(lastShopList);
    this.notifySubscribers(result);
    return result;
  }

  private notifySubscribers(shopList: ShoppingList): void {
    this.subscribers.forEach((handler) => {
      handler(shopList);
    });
  }

  private async updateListCustomer(shoppingList: ShoppingList, anonymousId: string): Promise<ShoppingList | null> {
    const actions: ShoppingListSetAnonymousIdAction = {
      action: ACTIONS.setAnonymousId,
      anonymousId,
    };
    const dataUserList = await this.root.setAnonymousId(shoppingList, actions);
    const result = this.getShopListFromData(dataUserList);
    this.notifySubscribers(result);

    return result;
  }

  public async addProduct(productId: string): Promise<ShoppingList> {
    const shoppingList = await this.getShoppingList();

    const actions: MyShoppingListAddLineItemAction[] = [
      {
        action: ACTIONS.addLineItem,
        productId,
      },
    ];

    const data = await this.root.addProduct(shoppingList, actions);
    const result = this.getShopListFromData(data);
    this.shoppingList = result;
    this.notifySubscribers(result);
    return result;
  }

  public async create(): Promise<ShoppingList> {
    const newShoppingList = await this.root.create();
    const shoppingList = this.getShopListFromData(newShoppingList);
    this.notifySubscribers(shoppingList);
    return shoppingList;
  }

  public async deleteProduct(products: ShoppingListProduct): Promise<ShoppingList> {
    const shoppingList = await this.getShoppingList();

    const data = await this.root.deleteProduct(shoppingList, products);
    const result = this.getShopListFromData(data);
    this.shoppingList = result;
    this.notifySubscribers(result);
    return result;
  }

  public getExistShopList(): ShoppingList | null {
    return this.shoppingList;
  }

  public async getShoppingList(): Promise<ShoppingList> {
    let shopList: ShoppingList | null = null;
    const { anonymousId, anonymousShopListId } = getStore().getState();
    if (anonymousShopListId && anonymousId) {
      shopList = await this.getAnonymousShoppingList(anonymousShopListId);
    }
    if (!shopList) {
      shopList = await this.getUserShoppingLists();
    }
    this.shoppingList = shopList;
    this.notifySubscribers(shopList);
    return shopList;
  }

  public subscribe(handler: ShoppingListChangeHandler): void {
    this.subscribers.push(handler);
  }
}

const createShoppingListModel = (): ShoppingListModel => new ShoppingListModel();

const shoppingListModel = createShoppingListModel();

export default function getShoppingListModel(): ShoppingListModel {
  return shoppingListModel;
}
