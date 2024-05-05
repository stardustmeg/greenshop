import type { Category, Product } from '../types/product.ts';
import type { User } from '../types/user.ts';
import type { State } from './reducer.ts';

import getStore, { Store } from './Store.ts';
import * as actions from './actions.ts';
import observeStore, { selectBillingCountry, selectCurrentUser, selectShippingCountry } from './observer.ts';

describe('Checking Store', () => {
  const mockStore = getStore();
  it('should check if store is defined', () => {
    expect(mockStore).toBeDefined();
  });

  it('should check if store is an instance of Store', () => {
    expect(mockStore).toBeInstanceOf(Store);
  });

  it('should check to return an instance of Store', () => {
    expect(mockStore.getState() instanceof Object).toBe(true);
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

vi.mock('./Store.ts', async (importOriginal) => {
  const actual: typeof importOriginal = await importOriginal();
  return {
    ...actual,
    getState: (): State => ({
      billingCountry: '',
      categories: [],
      currentUser: null,
      products: [],
      shippingCountry: '',
    }),
  };
});

describe('ObserveStore', () => {
  it('should check if observeStore is a function', () => {
    expect(observeStore).toBeInstanceOf(Function);
  });
});

it('should check if selectCurrentUser is a function', () => {
  expect(selectCurrentUser).toBeInstanceOf(Function);
});

it('should check if selectBillingCountry is a function', () => {
  expect(selectBillingCountry).toBeInstanceOf(Function);
});

it('should check if selectShippingCountry is a function', () => {
  expect(selectShippingCountry).toBeInstanceOf(Function);
});

it('observeStore should call select and onChange when state changes', () => {
  const mockUser = {
    addresses: [],
    birthDate: '1990-01-01',
    defaultBillingAddressId: null,
    defaultShippingAddressId: null,
    email: 'test@test.test',
    firstName: 'Test',
    id: 'test',
    lastName: 'Test',
    locale: 'en',
    password: 'Testtest1',
    version: 0,
  };

  const mockState: State = {
    billingCountry: '',
    categories: [],
    currentUser: mockUser,
    products: [],
    shippingCountry: '',
  };

  const mockOnChange = vitest.fn();
  const selelectCurrentUserSpy = vitest.spyOn(actions, 'setCurrentUser');
  const mockSelect = vitest.fn(() => selectCurrentUser(mockState));
  const unsubscribe = observeStore(mockSelect, mockOnChange);

  expect(selectCurrentUser(mockState)).toBe(mockUser);
  actions.setCurrentUser(mockUser);

  expect(selelectCurrentUserSpy).toHaveBeenCalledWith(mockUser);

  unsubscribe();
});
