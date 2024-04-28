import getStore, { Store } from './Store.ts';

const store = getStore();
describe('Checking Store', () => {
  it('should check if store is defined', () => {
    expect(store).toBeDefined();
  });

  it('should check if store is an instance of Store', () => {
    expect(store).toBeInstanceOf(Store);
  });

  it('should check to return an instance of Store', () => {
    expect(store.getState() instanceof Object).toBe(true);
  });
});
