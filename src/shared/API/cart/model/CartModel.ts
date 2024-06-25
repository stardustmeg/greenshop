import type { AddCartItem, Cart, CartCoupon, CartProduct, EditCartItem } from '@/shared/types/cart.ts';
import type {
  CartPagedQueryResponse,
  Cart as CartResponse,
  CartSetAnonymousIdAction,
  ClientResponse,
  DiscountedTotalPricePortion,
  LineItem,
  MyCartUpdateAction,
} from '@commercetools/platform-sdk';

import getStore from '@/shared/Store/Store.ts';
import { setAnonymousCartId, setAnonymousId } from '@/shared/Store/actions.ts';
import { PRICE_FRACTIONS } from '@/shared/constants/product.ts';
import { ChannelMessage } from '@/shared/types/channel.ts';
import { showErrorMessage } from '@/shared/utils/userMessage.ts';

import type { OptionsRequest } from '../../types/type.ts';

import getDiscountModel from '../../discount/model/DiscountModel.ts';
import getProductModel from '../../product/model/ProductModel.ts';
import FilterProduct from '../../product/utils/filter.ts';
import { Attribute, FilterFields } from '../../types/type.ts';
import { isCart, isCartPagedQueryResponse, isClientResponse } from '../../types/validation.ts';
import CartApi from '../CartApi.ts';

enum ACTIONS {
  addDiscountCode = 'addDiscountCode',
  addLineItem = 'addLineItem',
  changeLineItemQuantity = 'changeLineItemQuantity',
  removeDiscountCode = 'removeDiscountCode',
  removeLineItem = 'removeLineItem',
  setAnonymousId = 'setAnonymousId',
}

type Callback = (cart: Cart) => boolean;
export class CartModel {
  private callback: Callback[] = [];

  private channel: BroadcastChannel;

  private root: CartApi;

  constructor() {
    this.channel = new BroadcastChannel(`${import.meta.env.VITE_APP_CTP_PROJECT_KEY}`);
    this.root = new CartApi();
    this.getCart()
      .then((cart) => {
        const { anonymousId } = getStore().getState();
        if (anonymousId && cart?.anonymousId !== anonymousId) {
          this.updateCartCustomer(cart, anonymousId).catch(showErrorMessage);
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
    return {
      anonymousId: data.anonymousId || null,
      discountsCart: data.discountOnTotalPrice?.includedDiscounts.length
        ? this.adaptCartDiscount(data.discountOnTotalPrice?.includedDiscounts)
        : [],
      discountsProduct: this.adaptProductDiscount(data.lineItems) || [],
      id: data.id,
      products: data.lineItems.map((lineItem) => this.adaptLineItem(lineItem)),
      total: data.totalPrice.centAmount / PRICE_FRACTIONS || 0,
      version: data.version,
    };
  }

  private adaptCartDiscount(discounts: DiscountedTotalPricePortion[]): CartCoupon[] {
    const result: CartCoupon[] = [];
    const allDiscounts = getDiscountModel().getAllCoupons();
    discounts.forEach((discount) => {
      const findDiscount = allDiscounts.find((el) => el.id === discount.discount.id);
      if (findDiscount) {
        result.push({
          coupon: findDiscount,
          value: discount.discountedAmount.centAmount / PRICE_FRACTIONS || 0,
        });
      }
    });

    return result;
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

  private adaptProductDiscount(lineItems: LineItem[]): CartCoupon[] {
    const result: CartCoupon[] = [];
    const allDiscounts = getDiscountModel().getAllCoupons();
    lineItems.forEach((lineItem) => {
      lineItem.discountedPricePerQuantity.forEach((discountItem) => {
        const { quantity } = discountItem;
        discountItem.discountedPrice.includedDiscounts.forEach((discount) => {
          const findDiscount = allDiscounts.find((el) => el.id === discount.discount.id);
          if (findDiscount) {
            result.push({
              coupon: findDiscount,
              value: (discount.discountedAmount.centAmount * quantity) / PRICE_FRACTIONS || 0,
            });
          }
        });
      });
    });

    const uniqueCoupons: CartCoupon[] = result.reduce((acc: CartCoupon[], curr: CartCoupon) => {
      const existingCoupon = acc.find((coupon) => coupon.coupon.id === curr.coupon.id);

      if (existingCoupon) {
        existingCoupon.value += curr.value;
      } else {
        acc.push(curr);
      }

      return acc;
    }, []);

    return uniqueCoupons;
  }

  private async deleteOtherCarts(activeCart: Cart, data: ClientResponse<CartPagedQueryResponse>): Promise<void> {
    const carts: Cart[] = [];
    data.body.results.forEach((cart) => {
      carts.push(this.getCartFromData(cart));
    });
    const otherCarts = carts.filter((shopList) => activeCart.id !== shopList.id);
    await Promise.all(otherCarts.map((id) => this.root.deleteCart(id)));
  }

  private async getAnonymousCart(anonymousCartId: string): Promise<Cart | null> {
    const data = await this.root.getAnonymCart(anonymousCartId);
    if (!data.body.customerId) {
      const result = this.getCartFromData(data);
      return result;
    }

    return null;
  }

  private getCartFromData(data: CartResponse | ClientResponse<CartPagedQueryResponse | CartResponse>): Cart {
    let cart: Cart = {
      anonymousId: null,
      discountsCart: [],
      discountsProduct: [],
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
    if (data.body.count === 0) {
      const newCart = await this.root.create();
      return this.getCartFromData(newCart);
    }
    if (data.body.count === 1) {
      return this.getCartFromData(data);
    }
    const activeCart = await this.root.getActiveCart();
    const result = this.getCartFromData(activeCart);
    await this.deleteOtherCarts(result, data);
    return result;
  }

  private async updateCartCustomer(cart: Cart, anonymousId: string): Promise<Cart | null> {
    const actions: CartSetAnonymousIdAction[] = [
      {
        action: ACTIONS.setAnonymousId,
        anonymousId,
      },
    ];
    const dataSetId = await this.root.setAnonymousId(cart, actions);
    const result = this.getCartFromData(dataSetId);
    return result;
  }

  public async addCoupon(discountCode: string): Promise<Cart> {
    const cart = await this.getCart();

    const action: MyCartUpdateAction[] = [
      {
        action: ACTIONS.addDiscountCode,
        code: discountCode,
      },
    ];
    const data = await this.root.updateCart(cart, action);
    const result = this.getCartFromData(data);
    return result;
  }

  public async addProductInfo(): Promise<Cart | null> {
    const cart = await this.getCart();

    const filter = new FilterProduct();
    cart.products.forEach((product) => {
      filter.addFilter(FilterFields.ID, product.productId);
    });
    const opt: OptionsRequest = {
      filter,
      limit: cart.products.length,
    };

    return getProductModel()
      .getProducts(opt)
      .then((products) => {
        if (products.products.length && cart) {
          cart.products = cart.products.map((product) => {
            const productInfo = products.products.find(({ id }) => id === product.productId);
            if (productInfo) {
              if (!product.images) {
                return { ...product, images: productInfo.images[0] };
              }
            }

            return product;
          });
        }
        return cart;
      });
  }

  public async addProductToCart(addCartItem: AddCartItem): Promise<Cart | null> {
    const cart = await this.getCart();

    const actions: MyCartUpdateAction[] = [
      {
        action: ACTIONS.addLineItem,
        productId: addCartItem.productId,
        quantity: addCartItem.quantity,
        variantId: addCartItem.variantId,
      },
    ];
    const data = await this.root.updateCart(cart, actions);
    const result = this.getCartFromData(data);
    this.dispatchUpdate(result);
    this.channel.postMessage({ cart: result, type: ChannelMessage.ADD_PRODUCT });
    return result;
  }

  public async clearCart(): Promise<Cart | null> {
    const cart = await this.getCart();

    const actions: MyCartUpdateAction[] = cart?.products.map((lineItem) => ({
      action: ACTIONS.removeLineItem,
      lineItemId: lineItem.lineItemId,
    }));
    const data = await this.root.updateCart(cart, actions);
    const result = this.getCartFromData(data);
    this.dispatchUpdate(result);
    return result;
  }

  public create(): Promise<Cart | null> {
    return this.root
      .create()
      .then((newCart) => {
        const result = this.getCartFromData(newCart);
        this.dispatchUpdate(result);
        return result;
      })
      .catch((error: Error) => {
        showErrorMessage(error);
        return null;
      });
  }

  public async deleteCoupon(id: string): Promise<Cart> {
    const cart = await this.getCart();

    const action: MyCartUpdateAction[] = [
      {
        action: ACTIONS.removeDiscountCode,
        discountCode: {
          id,
          typeId: 'discount-code',
        },
      },
    ];
    const data = await this.root.updateCart(cart, action);
    const result = this.getCartFromData(data);
    return result;
  }

  public async deleteProductFromCart(cartItem: CartProduct): Promise<Cart | null> {
    const cart = await this.getCart();

    const actions: MyCartUpdateAction[] = [
      {
        action: ACTIONS.removeLineItem,
        lineItemId: cartItem.lineItemId,
      },
    ];
    const data = await this.root.updateCart(cart, actions);
    const result = this.getCartFromData(data);
    this.dispatchUpdate(result);
    return result;
  }

  public dispatchUpdate(cart: Cart): void {
    this.callback.forEach((callback) => callback(cart));
  }

  public async editProductCount(editCartItem: EditCartItem): Promise<Cart> {
    const cart = await this.getCart();

    const actions: MyCartUpdateAction[] = [
      {
        action: ACTIONS.changeLineItemQuantity,
        lineItemId: editCartItem.lineId,
        quantity: editCartItem.quantity,
      },
    ];

    const data = await this.root.updateCart(cart, actions);
    const result = this.getCartFromData(data);
    this.dispatchUpdate(result);
    return result;
  }

  public async getCart(): Promise<Cart> {
    let cart: Cart | null = null;
    const { anonymousCartId, anonymousId } = getStore().getState();
    if (anonymousCartId && anonymousId) {
      cart = await this.getAnonymousCart(anonymousCartId);
    }
    if (!cart) {
      cart = await this.getUserCart();
    }
    this.dispatchUpdate(cart);
    return cart;
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
