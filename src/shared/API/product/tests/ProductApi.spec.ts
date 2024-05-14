import getProductApi, { ProductApi } from '../ProductApi.ts';

const root = getProductApi();

describe('Checking ProductApi', () => {
  it('should check if root is defined', () => {
    expect(root).toBeDefined();
  });

  it('should check if ProductApi is an instance of ProductApi', () => {
    expect(root).toBeInstanceOf(ProductApi);
  });
});
