import type { AddCartItem, CartProduct, EditCartItem } from '@/shared/types/cart.ts';

import CartApi from '../CartApi.ts';
import getCartModel, { CartModel } from '../model/CartModel.ts';

/**
 * @vitest-environment jsdom
 */

const root = new CartApi();

describe('Checking CartApi', () => {
  it('should check if root is defined', () => {
    expect(root).toBeDefined();
  });

  it('should check if CartApi is an instance of CartApi', () => {
    expect(root).toBeInstanceOf(CartApi);
  });
});

describe('Checking CartModel', () => {
  const cartModel = getCartModel();
  it('should check if root is defined', () => {
    expect(cartModel).toBeDefined();
  });

  it('should check if CartModel is an instance of CartModel', () => {
    expect(cartModel).toBeInstanceOf(CartModel);
  });

  it('should get cart', async () => {
    const cart = await cartModel.getCart();
    expect(cart).toBeDefined();
    expect(cart).toHaveProperty('anonymousId');
    expect(cart).toHaveProperty('discountsCart');
    expect(cart).toHaveProperty('discountsProduct');
    expect(cart).toHaveProperty('id');
    expect(cart).toHaveProperty('products');
    expect(cart).toHaveProperty('total');
    expect(cart).toHaveProperty('version');
  });

  it('should add coupon', async () => {
    const cart = await cartModel.getCart();
    expect(cart).toBeDefined();
    const cartCoupon = await cartModel.addCoupon('coupon');
    expect(cartCoupon).toBeDefined();
    expect(cartCoupon).toHaveProperty('anonymousId');
    expect(cartCoupon).toHaveProperty('discountsCart');
    expect(cartCoupon).toHaveProperty('discountsProduct');
    expect(cartCoupon).toHaveProperty('id');
    expect(cartCoupon).toHaveProperty('products');
    expect(cartCoupon).toHaveProperty('total');
    expect(cartCoupon).toHaveProperty('version');
  });

  it('should add product to cart', async () => {
    const cart = await cartModel.getCart();
    expect(cart).toBeDefined();
    const lineItem: AddCartItem = {
      name: '',
      productId: 'd72d63d8-b116-4948-8b4f-035ea3adbb39',
      quantity: 1,
      variantId: 1,
    };
    const cartProduct = await cartModel.addProductToCart(lineItem);
    expect(cartProduct).toBeDefined();
    expect(cartProduct).toHaveProperty('anonymousId');
    expect(cartProduct).toHaveProperty('discountsCart');
    expect(cartProduct).toHaveProperty('discountsProduct');
    expect(cartProduct).toHaveProperty('id');
    expect(cartProduct).toHaveProperty('products');
    expect(cartProduct).toHaveProperty('total');
    expect(cartProduct).toHaveProperty('version');
  });

  it('should clear cart in model', () => {
    const cart = cartModel.clear();
    expect(cart).equal(true);
  });

  it('should clear cart', async () => {
    const cart = await cartModel.getCart();
    expect(cart).toBeDefined();
    const cartProduct = await cartModel.clearCart();
    expect(cartProduct).toBeDefined();
    expect(cartProduct).toHaveProperty('anonymousId');
    expect(cartProduct).toHaveProperty('discountsCart');
    expect(cartProduct).toHaveProperty('discountsProduct');
    expect(cartProduct).toHaveProperty('id');
    expect(cartProduct).toHaveProperty('products');
    expect(cartProduct).toHaveProperty('total');
    expect(cartProduct).toHaveProperty('version');
  });

  it('should create cart', async () => {
    const cartProduct = await cartModel.create();
    expect(cartProduct).toBeDefined();
    expect(cartProduct).toHaveProperty('anonymousId');
    expect(cartProduct).toHaveProperty('discountsCart');
    expect(cartProduct).toHaveProperty('discountsProduct');
    expect(cartProduct).toHaveProperty('id');
    expect(cartProduct).toHaveProperty('products');
    expect(cartProduct).toHaveProperty('total');
    expect(cartProduct).toHaveProperty('version');
  });

  it('should delete coupon', async () => {
    const cartProduct = await cartModel.deleteCoupon('');
    expect(cartProduct).toBeDefined();
    expect(cartProduct).toHaveProperty('anonymousId');
    expect(cartProduct).toHaveProperty('discountsCart');
    expect(cartProduct).toHaveProperty('discountsProduct');
    expect(cartProduct).toHaveProperty('id');
    expect(cartProduct).toHaveProperty('products');
    expect(cartProduct).toHaveProperty('total');
    expect(cartProduct).toHaveProperty('version');
  });

  it('should delete product from cart', async () => {
    const cartItem: CartProduct = {
      images: '',
      key: '',
      lineItemId: '',
      name: [],
      price: 0,
      priceCouponDiscount: 0,
      productId: '',
      quantity: 0,
      size: null,
      totalPrice: 0,
      totalPriceCouponDiscount: 0,
    };
    const cartProduct = await cartModel.deleteProductFromCart(cartItem);
    expect(cartProduct).toBeDefined();
    expect(cartProduct).toHaveProperty('anonymousId');
    expect(cartProduct).toHaveProperty('discountsCart');
    expect(cartProduct).toHaveProperty('discountsProduct');
    expect(cartProduct).toHaveProperty('id');
    expect(cartProduct).toHaveProperty('products');
    expect(cartProduct).toHaveProperty('total');
    expect(cartProduct).toHaveProperty('version');
  });

  it('should edit product count', async () => {
    const editCartItem: EditCartItem = {
      lineId: '',
      quantity: 0,
    };
    const cartProduct = await cartModel.editProductCount(editCartItem);
    expect(cartProduct).toBeDefined();
    expect(cartProduct).toHaveProperty('anonymousId');
    expect(cartProduct).toHaveProperty('discountsCart');
    expect(cartProduct).toHaveProperty('discountsProduct');
    expect(cartProduct).toHaveProperty('id');
    expect(cartProduct).toHaveProperty('products');
    expect(cartProduct).toHaveProperty('total');
    expect(cartProduct).toHaveProperty('version');
  });
});
