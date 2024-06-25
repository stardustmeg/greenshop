import CustomerApi from '../CustomerApi.ts';

/**
 * @vitest-environment jsdom
 */

const root = new CustomerApi();

describe('Checking CustomerApi', () => {
  it('should check if root is defined', () => {
    expect(root).toBeDefined();
  });

  it('should check if CustomerApi is an instance of CustomerApi', () => {
    expect(root).toBeInstanceOf(CustomerApi);
  });
});
