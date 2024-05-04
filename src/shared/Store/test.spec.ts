import type { Category, Product } from '../types/product.ts';
import type { User } from '../types/user.ts';

import getStore, { Store } from './Store.ts';
import * as actions from './actions.ts';

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

describe('Actions', () => {
  it('Checking actions', () => {
    expect(actions).toBeDefined();
  });
});

it('should check if setCurrentUser is a function', () => {
  expect(actions.setCurrentUser).toBeInstanceOf(Function);
});

it('should check if setShippingCountry is a function', () => {
  expect(actions.setShippingCountry).toBeInstanceOf(Function);
});

it('should check if setBillingCountry is a function', () => {
  expect(actions.setBillingCountry).toBeInstanceOf(Function);
});

it('should check if setCategories is a function', () => {
  expect(actions.setCategories).toBeInstanceOf(Function);
});

it('should check if setProducts is a function', () => {
  expect(actions.setProducts).toBeInstanceOf(Function);
});

it('setCategories should create a correct action', () => {
  const value: Category[] = [];
  const action = actions.setCategories(value);
  expect(action.type).toBe('setCategories');
  expect(action.payload).toBe(value);
});

it('setProducts should create a correct action', () => {
  const value: Product[] = [];
  const action = actions.setProducts(value);
  expect(action.type).toBe('setProducts');
  expect(action.payload).toBe(value);
});

it('setCurrentUser should create a correct action', () => {
  const value: User | null = null;
  const action = actions.setCurrentUser(value);
  expect(action.type).toBe('setCurrentUser');
  expect(action.payload).toBe(value);
});

it('setShippingCountry should create a correct action', () => {
  const value = '';
  const action = actions.setShippingCountry(value);
  expect(action.type).toBe('setShippingCountry');
  expect(action.payload).toBe(value);
});

it('setBillingCountry should create a correct action', () => {
  const value = '';
  const action = actions.setBillingCountry(value);
  expect(action.type).toBe('setBillingCountry');
  expect(action.payload).toBe(value);
});
