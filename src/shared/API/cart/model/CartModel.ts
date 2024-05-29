import type { AddCartItem, Cart, CartProduct, EditCartItem } from '@/shared/types/cart.ts';
import type {
  CartPagedQueryResponse,
  Cart as CartResponse,
  ClientResponse,
  LineItem,
  MyCartUpdateAction,
} from '@commercetools/platform-sdk';

import getStore from '@/shared/Store/Store.ts';
import { setAnonymousCartId, setAnonymousId } from '@/shared/Store/actions.ts';
import { PRICE_FRACTIONS } from '@/shared/constants/product.ts';

import type { OptionsRequest } from '../../types/type.ts';

import getProductModel from '../../product/model/ProductModel.ts';
import FilterProduct from '../../product/utils/filter.ts';
import { FilterFields } from '../../types/type.ts';
import { isCart, isCartPagedQueryResponse, isClientResponse } from '../../types/validation.ts';
import getCartApi, { type CartApi } from '../CartApi.ts';

type Callback = (cart: Cart) => boolean;
export class CartModel {
  private callback: Callback[] = [];

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
    const discount = data.discountOnTotalPrice?.discountedAmount?.centAmount;
    return {
      discounts: discount ? discount / PRICE_FRACTIONS : 0,
      id: data.id,
      products: data.lineItems.map((lineItem) => this.adaptLineItem(lineItem)),
      total: data.totalPrice.centAmount / PRICE_FRACTIONS || 0,
      version: data.version,
    };
  }

  private adaptLineItem(product: LineItem): CartProduct {
    const result: CartProduct = {
      images: product.variant.images?.length ? product.variant.images[0].url : '',
      key: product.productKey || '',
      lineItemId: product.id,
      name: [],
      price: product.price.value.centAmount / PRICE_FRACTIONS || 0,
      productId: product.productId || '',
      quantity: product.quantity || 0,
      size: null,
      totalPrice: product.totalPrice.centAmount / PRICE_FRACTIONS || 0,
    };
    result.name.push(...getProductModel().adaptLocalizationValue(product.name));
    if (product.variant.attributes) {
      const size = product.variant.attributes.find((attr) => attr.name === 'size');
      if (size) {
        result.size = getProductModel().adaptSize(size);
      }
    }
    return result;
  }

  private dispatchUpdate(): void {
    this.callback.forEach((callback) => (this.cart !== null ? callback(this.cart) : null));
  }

  private getCartFromData(data: ClientResponse<CartPagedQueryResponse | CartResponse>): Cart {
    let cart: Cart = {
      discounts: 0,
      id: '',
      products: [],
      total: 0,
      version: 0,
    };
    if (isClientResponse(data) && isCart(data.body)) {
      cart = this.adaptCart(data.body);
    } else if (isClientResponse(data) && isCartPagedQueryResponse(data.body) && data.body.results.length) {
      cart = this.adaptCart(data.body.results[0]);
    }
    return cart;
  }

  public async addCoupon(discountCode: string): Promise<Cart> {
    if (!this.cart) {
      this.cart = await this.getCart();
    }
    const action: MyCartUpdateAction[] = [
      {
        action: 'addDiscountCode',
        code: discountCode,
      },
    ];
    const data = await this.root.updateCart(this.cart, action);
    if (isClientResponse(data)) {
      this.cart = this.getCartFromData(data);
    }

    return this.cart;
  }

  public async addProductInfo(): Promise<Cart> {
    if (!this.cart) {
      this.cart = await this.getCart();
    }

    const filter = new FilterProduct();
    this.cart.products.forEach((product) => {
      filter.addFilter(FilterFields.ID, product.productId);
    });
    const opt: OptionsRequest = {
      filter,
      limit: this.cart.products.length,
    };

    const products = await getProductModel().getProducts(opt);

    if (products.products.length) {
      this.cart.products = this.cart.products.map((product) => {
        const productInfo = products.products.find(({ id }) => id === product.productId);
        if (productInfo) {
          if (!product.images) {
            return { ...product, images: productInfo.images[0] };
          }
        }

        return product;
      });
    }

    return this.cart;
  }

  public async addProductToCart(addCartItem: AddCartItem): Promise<Cart> {
    if (!this.cart) {
      this.cart = await this.getCart();
    }
    const data = await this.root.addProduct(this.cart, addCartItem);
    this.cart = this.getCartFromData(data);

    this.dispatchUpdate();

    return this.cart;
  }

  public clear(): boolean {
    this.cart = null;
    return true;
  }

  public async clearCart(): Promise<Cart> {
    if (!this.cart) {
      this.cart = await this.getCart();
    }
    const actions: MyCartUpdateAction[] = this.cart?.products.map((lineItem) => ({
      action: 'removeLineItem',
      lineItemId: lineItem.lineItemId,
    }));
    const data = await this.root.updateCart(this.cart, actions);
    if (isClientResponse(data)) {
      this.cart = this.getCartFromData(data);
    }

    this.dispatchUpdate();
    return this.cart;
  }

  public async create(): Promise<Cart> {
    const newCart = await this.root.create();
    this.cart = this.getCartFromData(newCart);

    this.dispatchUpdate();

    return this.cart;
  }

  public async deleteProductFromCart(products: CartProduct): Promise<Cart> {
    if (!this.cart) {
      this.cart = await this.getCart();
    }
    const data = await this.root.deleteProduct(this.cart, products);
    this.cart = this.getCartFromData(data);

    this.dispatchUpdate();

    return this.cart;
  }

  public async editProductCount(editCartItem: EditCartItem): Promise<Cart> {
    if (!this.cart) {
      this.cart = await this.getCart();
    }
    const data = await this.root.editProductCount(this.cart, editCartItem);
    this.cart = this.getCartFromData(data);
    this.dispatchUpdate();
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
    this.dispatchUpdate();
    return this.cart;
  }

  public observeCartChange(callback: (cart: Cart) => boolean): boolean {
    this.callback.push(callback);
    return true;
  }
}

const createCartModel = (): CartModel => new CartModel();

const cartModel = createCartModel();

export default function getCartModel(): CartModel {
  return cartModel;
}
