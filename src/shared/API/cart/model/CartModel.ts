import type { AddCartItem, Cart, CartProduct, EditCartItem } from '@/shared/types/cart.ts';
import type {
  CartPagedQueryResponse,
  Cart as CartResponse,
  ClientResponse,
  LineItem,
} from '@commercetools/platform-sdk';

import getStore from '@/shared/Store/Store.ts';
import { setAnonymousCartId, setAnonymousId } from '@/shared/Store/actions.ts';

import getProductModel from '../../product/model/ProductModel.ts';
import { isCart, isCartPagedQueryResponse, isClientResponse } from '../../types/validation.ts';
import getCartApi, { type CartApi } from '../CartApi.ts';

export class CartModel {
  private cart: Cart | null = null;

  private root: CartApi;

  constructor() {
    this.root = getCartApi();
  }

  private adaptCart(data: CartResponse): Cart {
    if (data.anonymousId) {
      getStore().dispatch(setAnonymousCartId(data.id));
      getStore().dispatch(setAnonymousId(data.anonymousId));
    }
    return {
      id: data.id,
      products: data.lineItems.map((lineItem) => this.adaptLineItem(lineItem)),
      version: data.version,
    };
  }

  private adaptLineItem(product: LineItem): CartProduct {
    const result: CartProduct = {
      images: product.variant.images?.length ? product.variant.images[0].url : '',
      key: product.productKey || '',
      lineItemId: product.id,
      name: [],
      price: product.price.value.centAmount || 0,
      productId: product.productId || '',
      quantity: product.quantity || 0,

      totalPrice: product.totalPrice.centAmount || 0,
    };
    result.name.push(...getProductModel().adaptLocalizationValue(product.name));
    return result;
  }

  private getCartFromData(data: ClientResponse<CartPagedQueryResponse | CartResponse>): Cart {
    let cart: Cart = {
      id: '',
      products: [],
      version: 0,
    };
    if (isClientResponse(data) && isCart(data.body)) {
      cart = this.adaptCart(data.body);
    } else if (isClientResponse(data) && isCartPagedQueryResponse(data.body) && data.body.results.length) {
      cart = this.adaptCart(data.body.results[0]);
    }
    return cart;
  }

  public async addProductToCart(addCartItem: AddCartItem): Promise<Cart> {
    if (!this.cart) {
      this.cart = await this.getCart();
    }
    const data = await this.root.addProduct(this.cart, addCartItem);
    this.cart = this.getCartFromData(data);
    return this.cart;
  }

  public clear(): boolean {
    this.cart = null;
    return true;
  }

  public async create(): Promise<Cart> {
    const newCart = await this.root.create();
    this.cart = this.getCartFromData(newCart);
    return this.cart;
  }

  public async deleteProductFromCart(products: CartProduct): Promise<Cart | null> {
    if (this.cart) {
      const data = await this.root.deleteProduct(this.cart, products);
      this.cart = this.getCartFromData(data);
    }
    return this.cart;
  }

  public async editProductCount(editCartItem: EditCartItem): Promise<Cart> {
    if (!this.cart) {
      this.cart = await this.getCart();
    }
    const data = await this.root.editProductCount(this.cart, editCartItem);
    this.cart = this.getCartFromData(data);
    return this.cart;
  }

  public async getCart(): Promise<Cart> {
    if (!this.cart) {
      const data = await this.root.getCarts();
      if (data.body.count === 1) {
        this.cart = this.getCartFromData(data);
      } else if (data.body.count === 0) {
        const newCart = await this.root.create();
        this.cart = this.getCartFromData(newCart);
      } else {
        const activeCart = await this.root.getActiveCart();
        this.cart = this.getCartFromData(activeCart);
      }
    }
    return this.cart;
  }
}

const createCartModel = (): CartModel => new CartModel();

const cartModel = createCartModel();

export default function getCartModel(): CartModel {
  return cartModel;
}
