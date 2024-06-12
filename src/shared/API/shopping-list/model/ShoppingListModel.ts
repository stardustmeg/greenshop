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

import type { OptionsRequest } from '../../types/type.ts';

import {
  isClientResponse,
  isErrorResponse,
  isShoppingList,
  isShoppingListPagedQueryResponse,
} from '../../types/validation.ts';
import getShoppingListApi, { type ShoppingListApi } from '../ShoppingListApi.ts';

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
    this.root = getShoppingListApi();
    this.getShoppingList()
      .then(() => {
        const { anonymousId } = getStore().getState();
        if (anonymousId && this.shoppingList?.anonymousId !== anonymousId) {
          this.updateListCustomer(anonymousId).catch(showErrorMessage);
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

  private async getAnonymousShoppingList(
    anonymousShopListId: string,
    options?: OptionsRequest,
  ): Promise<ShoppingList | null> {
    const dataAnonymList = await this.root.getAnonymList(anonymousShopListId, options);
    const anonymShoppingList = this.getShopListFromData(dataAnonymList);
    if (anonymShoppingList.id && !dataAnonymList.body.customer?.id) {
      this.shoppingList = anonymShoppingList;
      this.notifySubscribers();
    }
    return this.shoppingList;
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

  private async getUserShoppingLists(options?: OptionsRequest): Promise<ShoppingList> {
    const data = await this.root.get(options);
    if (data.body.count === 0) {
      const newShopList = await this.root.create();
      this.shoppingList = this.getShopListFromData(newShopList);
    } else if (data.body.count > 1) {
      this.shoppingList = await this.mergeShopLists(data);
    } else {
      this.shoppingList = this.getShopListFromData(data);
    }
    this.notifySubscribers();
    return this.shoppingList;
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
    this.shoppingList = this.getShopListFromData(lastShopList);
    this.notifySubscribers();
    return this.shoppingList;
  }

  private notifySubscribers(): void {
    if (this.shoppingList) {
      this.subscribers.forEach((handler) => {
        if (this.shoppingList) {
          handler(this.shoppingList);
        }
      });
    }
  }

  private async updateListCustomer(anonymousId: string): Promise<ShoppingList | null> {
    if (this.shoppingList) {
      const actions: ShoppingListSetAnonymousIdAction = {
        action: ACTIONS.setAnonymousId,
        anonymousId,
      };
      const dataUserList = await this.root.setAnonymousId(this.shoppingList, actions);
      this.shoppingList = this.getShopListFromData(dataUserList);
      this.notifySubscribers();
    }
    return this.shoppingList;
  }

  public async addProduct(productId: string): Promise<ShoppingList> {
    if (!this.shoppingList) {
      this.shoppingList = await this.getShoppingList();
    }
    const actions: MyShoppingListAddLineItemAction[] = [
      {
        action: ACTIONS.addLineItem,
        productId,
      },
    ];

    const data = await this.root.addProduct(this.shoppingList, actions);
    this.shoppingList = this.getShopListFromData(data);
    this.notifySubscribers();
    return this.shoppingList;
  }

  public clear(): boolean {
    this.shoppingList = null;
    return true;
  }

  public async create(): Promise<ShoppingList> {
    const newShoppingList = await this.root.create();
    this.shoppingList = this.getShopListFromData(newShoppingList);
    this.notifySubscribers();
    return this.shoppingList;
  }

  public async deleteProduct(products: ShoppingListProduct): Promise<ShoppingList> {
    if (!this.shoppingList) {
      this.shoppingList = await this.getShoppingList();
    }
    const data = await this.root.deleteProduct(this.shoppingList, products);
    this.shoppingList = this.getShopListFromData(data);
    this.notifySubscribers();
    return this.shoppingList;
  }

  public async getShoppingList(options?: OptionsRequest): Promise<ShoppingList> {
    if (!this.shoppingList) {
      const { anonymousId, anonymousShopListId } = getStore().getState();
      if (anonymousShopListId && anonymousId) {
        this.shoppingList = await this.getAnonymousShoppingList(anonymousShopListId, options);
      }
      if (!this.shoppingList) {
        this.shoppingList = await this.getUserShoppingLists(options);
      }
      this.notifySubscribers();
    }
    return this.shoppingList;
  }

  public subscribe(handler: ShoppingListChangeHandler): void {
    this.subscribers.push(handler);
    if (this.shoppingList) {
      handler(this.shoppingList);
    }
  }
}

const createShoppingListModel = (): ShoppingListModel => new ShoppingListModel();

const shoppingListModel = createShoppingListModel();

export default function getShoppingListModel(): ShoppingListModel {
  return shoppingListModel;
}
