import ProductApi from '../ProductApi.ts';

/**
 * @vitest-environment jsdom
 */

const root = new ProductApi();

describe('Checking ProductApi', () => {
  it('should check if root is defined', () => {
    expect(root).toBeDefined();
  });

  it('should check if ProductApi is an instance of ProductApi', () => {
    expect(root).toBeInstanceOf(ProductApi);
  });
});
