import type { AddCartItem, Cart, CartCoupon, CartProduct, EditCartItem } from '@/shared/types/cart.ts';
import type {
  CartPagedQueryResponse,
  Cart as CartResponse,
  CartSetAnonymousIdAction,
  ClientResponse,
  LineItem,
  MyCartUpdateAction,
} from '@commercetools/platform-sdk';

import getStore from '@/shared/Store/Store.ts';
import { setAnonymousCartId, setAnonymousId } from '@/shared/Store/actions.ts';
import { PRICE_FRACTIONS } from '@/shared/constants/product.ts';
import { showErrorMessage } from '@/shared/utils/userMessage.ts';

import type { OptionsRequest } from '../../types/type.ts';

import getDiscountModel from '../../discount/model/DiscountModel.ts';
import getProductModel from '../../product/model/ProductModel.ts';
import FilterProduct from '../../product/utils/filter.ts';
import { Attribute, FilterFields } from '../../types/type.ts';
import { isCart, isCartPagedQueryResponse, isClientResponse } from '../../types/validation.ts';
import getCartApi, { type CartApi } from '../CartApi.ts';

enum ACTIONS {
  addDiscountCode = 'addDiscountCode',
  removeDiscountCode = 'removeDiscountCode',
  removeLineItem = 'removeLineItem',
  setAnonymousId = 'setAnonymousId',
}

type Callback = (cart: Cart) => boolean;
export class CartModel {
  private callback: Callback[] = [];

  private cart: Cart | null = null;

  private root: CartApi;

  constructor() {
    this.root = getCartApi();
    this.getCart()
      .then(() => {
        const { anonymousId } = getStore().getState();
        if (anonymousId && this.cart?.anonymousId !== anonymousId) {
          this.updateCartCustomer(anonymousId).catch(showErrorMessage);
        }
      })
      .catch(showErrorMessage);
  }

  private adaptCart(data: CartResponse): Cart {
    const { anonymousId, authToken } = getStore().getState();
    if (data.anonymousId && !authToken) {
      getStore().dispatch(setAnonymousCartId(data.id));
    }
    if (data.anonymousId && !authToken && !anonymousId) {
      getStore().dispatch(setAnonymousId(data.anonymousId));
    }
    const discounts: CartCoupon[] = [];
    if (data.discountOnTotalPrice && data.discountOnTotalPrice.includedDiscounts.length) {
      const allDiscounts = getDiscountModel().getAllCoupons();
      data.discountOnTotalPrice.includedDiscounts.forEach((discount) => {
        const findDiscount = allDiscounts.find((el) => el.id === discount.discount.id);
        if (findDiscount && discount.discountedAmount.centAmount > 0) {
          discounts.push({
            coupon: findDiscount,
            value: discount.discountedAmount.centAmount / PRICE_FRACTIONS || 0,
          });
        }
      });
    }
    return {
      anonymousId: data.anonymousId || null,
      discounts,
      id: data.id,
      products: data.lineItems.map((lineItem) => this.adaptLineItem(lineItem)),
      total: data.totalPrice.centAmount / PRICE_FRACTIONS || 0,
      version: data.version,
    };
  }

  private adaptLineItem(product: LineItem): CartProduct {
    const price = product.price.discounted?.value.centAmount
      ? product.price.discounted?.value.centAmount
      : product.price.value.centAmount;
    const priceCoupon =
      product.discountedPricePerQuantity.length &&
      product.discountedPricePerQuantity[0].discountedPrice.value.centAmount
        ? product.discountedPricePerQuantity[0].discountedPrice.value.centAmount
        : 0;
    const result: CartProduct = {
      images: product.variant.images?.length ? product.variant.images[0].url : '',
      key: product.productKey || '',
      lineItemId: product.id,
      name: [],
      price: price / PRICE_FRACTIONS || 0,
      priceCouponDiscount: priceCoupon / PRICE_FRACTIONS || 0,
      productId: product.productId || '',
      quantity: product.quantity || 0,
      size: null,
      totalPrice: priceCoupon
        ? (price * product.quantity) / PRICE_FRACTIONS || 0
        : product.totalPrice.centAmount / PRICE_FRACTIONS || 0,
      totalPriceCouponDiscount: priceCoupon ? product.totalPrice.centAmount / PRICE_FRACTIONS || 0 : 0,
    };
    result.name.push(...getProductModel().adaptLocalizationValue(product.name));
    if (product.variant.attributes) {
      const size = product.variant.attributes.find((attr) => attr.name === Attribute.SIZE);
      if (size) {
        result.size = getProductModel().adaptSize(size);
      }
    }
    return result;
  }

  private async deleteOtherCarts(data: ClientResponse<CartPagedQueryResponse>): Promise<void> {
    if (this.cart) {
      const carts: Cart[] = [];
      data.body.results.forEach((cart) => {
        carts.push(this.getCartFromData(cart));
      });
      const otherCarts = carts.filter((shopList) => this.cart?.id !== shopList.id);
      await Promise.all(otherCarts.map((id) => this.root.deleteCart(id)));
    }
  }

  private dispatchUpdate(): void {
    this.callback.forEach((callback) => (this.cart !== null ? callback(this.cart) : null));
  }

  private async getAnonymousCart(anonymousCartId: string): Promise<Cart | null> {
    const data = await this.root.getAnonymCart(anonymousCartId);
    if (!data.body.customerId) {
      this.cart = this.getCartFromData(data);
    }

    return this.cart;
  }

  private getCartFromData(data: CartResponse | ClientResponse<CartPagedQueryResponse | CartResponse>): Cart {
    let cart: Cart = {
      anonymousId: null,
      discounts: [],
      id: '',
      products: [],
      total: 0,
      version: 0,
    };
    if (isClientResponse(data) && isCart(data.body)) {
      cart = this.adaptCart(data.body);
    } else if (isClientResponse(data) && isCartPagedQueryResponse(data.body) && data.body.results.length) {
      cart = this.adaptCart(data.body.results[0]);
    } else if (isCart(data)) {
      cart = this.adaptCart(data);
    }
    return cart;
  }

  private async getUserCart(): Promise<Cart> {
    const data = await this.root.getCarts();
    if (data.body.count === 1) {
      this.cart = this.getCartFromData(data);
    } else if (data.body.count === 0) {
      const newCart = await this.root.create();
      this.cart = this.getCartFromData(newCart);
    } else {
      const activeCart = await this.root.getActiveCart();
      this.cart = this.getCartFromData(activeCart);
      await this.deleteOtherCarts(data);
    }
    return this.cart;
  }

  private async updateCartCustomer(anonymousId: string): Promise<Cart | null> {
    if (this.cart) {
      const actions: CartSetAnonymousIdAction = {
        action: ACTIONS.setAnonymousId,
        anonymousId,
      };
      const dataSetId = await this.root.setAnonymousId(this.cart, actions);
      this.cart = this.getCartFromData(dataSetId);
    }
    return this.cart;
  }

  public async addCoupon(discountCode: string): Promise<Cart> {
    if (!this.cart) {
      this.cart = await this.getCart();
    }
    const action: MyCartUpdateAction[] = [
      {
        action: ACTIONS.addDiscountCode,
        code: discountCode,
      },
    ];
    const data = await this.root.updateCart(this.cart, action);
    this.cart = this.getCartFromData(data);
    return this.cart;
  }

  public async addProductInfo(): Promise<Cart | null> {
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

    return getProductModel()
      .getProducts(opt)
      .then((products) => {
        if (products.products.length && this.cart) {
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
      });
  }

  public async addProductToCart(addCartItem: AddCartItem): Promise<Cart | null> {
    const data = await this.root.addProduct(await this.getCart(), addCartItem);
    this.cart = this.getCartFromData(data);
    this.dispatchUpdate();
    return this.cart;
  }

  public clear(): boolean {
    this.cart = null;
    return true;
  }

  public async clearCart(): Promise<Cart | null> {
    if (!this.cart) {
      this.cart = await this.getCart();
    }
    const actions: MyCartUpdateAction[] = this.cart?.products.map((lineItem) => ({
      action: ACTIONS.removeLineItem,
      lineItemId: lineItem.lineItemId,
    }));
    const data = await this.root.updateCart(this.cart, actions);
    this.cart = this.getCartFromData(data);
    this.dispatchUpdate();
    return this.cart;
  }

  public create(): Promise<Cart | null> {
    return this.root
      .create()
      .then((newCart) => {
        this.cart = this.getCartFromData(newCart);
        this.dispatchUpdate();
        return this.cart;
      })
      .catch((error: Error) => {
        showErrorMessage(error);
        return this.cart;
      });
  }

  public async deleteCoupon(id: string): Promise<Cart> {
    if (!this.cart) {
      this.cart = await this.getCart();
    }
    const action: MyCartUpdateAction[] = [
      {
        action: ACTIONS.removeDiscountCode,
        discountCode: {
          id,
          typeId: 'discount-code',
        },
      },
    ];
    const data = await this.root.updateCart(this.cart, action);
    this.cart = this.getCartFromData(data);
    return this.cart;
  }

  public async deleteProductFromCart(products: CartProduct): Promise<Cart | null> {
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
      const { anonymousCartId, anonymousId } = getStore().getState();
      if (anonymousCartId && anonymousId) {
        this.cart = await this.getAnonymousCart(anonymousCartId);
      }
      if (!this.cart) {
        this.cart = await this.getUserCart();
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
