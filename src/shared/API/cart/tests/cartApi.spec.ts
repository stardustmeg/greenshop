import getCartApi, { CartApi } from '../CartApi.ts';

const root = getCartApi();

describe('Checking CartApi', () => {
  it('should check if root is defined', () => {
    expect(root).toBeDefined();
  });

  it('should check if CartApi is an instance of CartApi', () => {
    expect(root).toBeInstanceOf(CartApi);
  });
});
