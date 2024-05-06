import { Size, type localization } from '@/shared/types/product.ts';
import getSize from '@/shared/utils/size.ts';

import getProductModel, { ProductModel } from '../model/ProductModel.ts';

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
    const productsArr = await productModel.getProducts();
    if (productsArr) {
      expect(productsArr).toBeDefined();
      productsArr.forEach((product) => {
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

  it('should get the product by id', async () => {
    const product = await productModel.getProductById('e5381b83-a7c4-4060-9fdb-f4123db54dd2');
    if (product) {
      expect(product).toBeDefined();
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
    }
  });
});

describe('getSize function', () => {
  it('should return Size.S when called with "S"', () => {
    const result = getSize('S');
    expect(result).toBe(Size.S);
  });

  it('should return Size.M when called with "M"', () => {
    const result = getSize('M');
    expect(result).toBe(Size.M);
  });

  it('should return null when called with an unknown size', () => {
    const result = getSize('unknown size');
    expect(result).toBeNull();
  });
});
