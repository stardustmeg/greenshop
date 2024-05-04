import getRoot, { RootApi } from './root.ts';

const root = getRoot();

describe('Checking Root Api', () => {
  it('should check if root is defined', () => {
    expect(root).toBeDefined();
  });

  it('should check if customerModel is an instance of CustomerModel', () => {
    expect(root).toBeInstanceOf(RootApi);
  });
});
