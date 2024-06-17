import type { ShoppingListProduct } from '@/shared/types/shopping-list.ts';

import ShoppingListApi from '../ShoppingListApi.ts';
import getShoppingListModel, { ShoppingListModel } from '../model/ShoppingListModel.ts';

/**
 * @vitest-environment jsdom
 */

const root = new ShoppingListApi();

describe('Checking ShoppingListApi', () => {
  it('should check if root is defined', () => {
    expect(root).toBeDefined();
  });

  it('should check if root is an instance of ShoppingListApi', () => {
    expect(root).toBeInstanceOf(ShoppingListApi);
  });
});

describe('Checking ShoppingListModel', () => {
  const shopModel = getShoppingListModel();
  it('should check if shopModel is defined', () => {
    expect(shopModel).toBeDefined();
  });

  it('should check if shopModel is an instance of ShoppingListModel', () => {
    expect(shopModel).toBeInstanceOf(ShoppingListModel);
  });

  it('should get ShopList', async () => {
    const shop = await shopModel.getShoppingList();
    expect(shop).toBeDefined();
    expect(shop).toHaveProperty('anonymousId');
    expect(shop).toHaveProperty('id');
    expect(shop).toHaveProperty('products');
    expect(shop).toHaveProperty('version');
  });

  it('should add product to ShopList', async () => {
    const shop = await shopModel.getShoppingList();
    expect(shop).toBeDefined();
    const shopProduct = await shopModel.addProduct('');
    expect(shopProduct).toBeDefined();
    expect(shopProduct).toHaveProperty('anonymousId');
    expect(shopProduct).toHaveProperty('id');
    expect(shopProduct).toHaveProperty('products');
    expect(shopProduct).toHaveProperty('version');
  });

  it('should clear shopModel in model', () => {
    const shop = shopModel.clear();
    expect(shop).equal(true);
  });

  it('should delete product from shopModel', async () => {
    const product: ShoppingListProduct = {
      lineItemId: '',
      productId: '',
    };
    const shopProduct = await shopModel.deleteProduct(product);
    expect(shopProduct).toBeDefined();
    expect(shopProduct).toHaveProperty('anonymousId');
    expect(shopProduct).toHaveProperty('id');
    expect(shopProduct).toHaveProperty('products');
    expect(shopProduct).toHaveProperty('version');
  });
});
