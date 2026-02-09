import { type localization } from '@/shared/types/product.ts';

import getProductModel, { ProductModel } from '../model/ProductModel.ts';

/**
 * @vitest-environment jsdom
 */

const productModel = getProductModel();

describe('Checking Product Model', () => {
  it('should check if productModel is defined', () => {
    expect(productModel).toBeDefined();
  });

  it('should check if productModel is an instance of ProductModel', () => {
    expect(productModel).toBeInstanceOf(ProductModel);
  });

  it('should get the categories', async () => {
    const categoryArr = await productModel.getCategories();
    if (categoryArr) {
      expect(categoryArr).toBeDefined();
      categoryArr.forEach((category) => {
        expect(typeof category.id).toBe('string');
        expect(typeof category.key).toBe('string');
        expect(Array.isArray(category.name)).toBe(true);
        category.name.forEach((localization: localization) => {
          expect(typeof localization.language).toBe('string');
          expect(typeof localization.value).toBe('string');
        });
      });
    }
  });

  it('should get the products list', async () => {
    const { products } = await productModel.getProducts();
    if (products) {
      expect(products).toBeDefined();
      products.forEach((product) => {
        expect(typeof product.id).toBe('string');
        expect(typeof product.key).toBe('string');
        expect(Array.isArray(product.name)).toBe(true);
        product.name.forEach((localization: localization) => {
          expect(typeof localization.language).toBe('string');
          expect(typeof localization.value).toBe('string');
        });
        expect(Array.isArray(product.description)).toBe(true);
        product.description.forEach((localization: localization) => {
          expect(typeof localization.language).toBe('string');
          expect(typeof localization.value).toBe('string');
        });
        expect(Array.isArray(product.fullDescription)).toBe(true);
        product.fullDescription.forEach((localization: localization) => {
          expect(typeof localization.language).toBe('string');
          expect(typeof localization.value).toBe('string');
        });
        expect(Array.isArray(product.images)).toBe(true);
        expect(Array.isArray(product.category)).toBe(true);
        expect(Array.isArray(product.variant)).toBe(true);
      });
    }
  });
});
