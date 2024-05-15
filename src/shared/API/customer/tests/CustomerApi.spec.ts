import getCustomerApi, { CustomerApi } from '../CustomerApi.ts';

const root = getCustomerApi();

describe('Checking CustomerApi', () => {
  it('should check if root is defined', () => {
    expect(root).toBeDefined();
  });

  it('should check if CustomerApi is an instance of CustomerApi', () => {
    expect(root).toBeInstanceOf(CustomerApi);
  });
});
