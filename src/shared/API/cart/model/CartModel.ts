import type { AddCartItem, CartProduct, DeleteCartItem } from '@/shared/types/product.ts';
import type { Cart } from '@/shared/types/user.ts';
import type {
  CartPagedQueryResponse,
  Cart as CartResponse,
  ClientResponse,
  LineItem,
} from '@commercetools/platform-sdk';

import getProductModel from '../../product/model/ProductModel.ts';
import { isCart, isCartPagedQueryResponse, isClientResponse } from '../../types/validation.ts';
import getCartApi, { type CartApi } from '../CartApi.ts';

export class CartModel {
  private root: CartApi;

  constructor() {
    this.root = getCartApi();
  }

  private adaptCart(data: CartResponse): Cart {
    return {
      id: data.id,
      products: data.lineItems.map((lineItem) => this.adaptLineItem(lineItem)),
      version: data.version,
    };
  }

  private adaptLineItem(product: LineItem): CartProduct {
    const result: CartProduct = {
      images: '',
      key: product.key || '',
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
    const data = await this.root.addProductToCart(addCartItem);
    return this.getCartFromData(data);
  }

  public async deleteProductFromCart(deleteCartItem: DeleteCartItem): Promise<Cart> {
    const data = await this.root.deleteProductToCart(deleteCartItem);
    return this.getCartFromData(data);
  }

  public async getCart(): Promise<Cart> {
    const data = await this.root.getCarts();
    let cart = this.getCartFromData(data);
    if (!cart.id) {
      const newCart = await this.root.createCarts();
      cart = this.getCartFromData(newCart);
    }
    return cart;
  }
}

const createCartModel = (): CartModel => new CartModel();

const cartModel = createCartModel();

export default function getCartModel(): CartModel {
  return cartModel;
}
