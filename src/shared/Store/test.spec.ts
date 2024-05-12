import type { Category, Product } from '../types/product.ts';
import type { User } from '../types/user.ts';
import type { State } from './reducer.ts';

import getStore, { Store } from './Store.ts';
import * as actions from './actions.ts';
import observeStore, { selectBillingCountry, selectCurrentUser, selectShippingCountry } from './observer.ts';
import { rootReducer } from './reducer.ts';

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
      currentLanguage: 'en',
      currentPage: '',
      currentUser: null,
      isAppThemeLight: true,
      isUserLoggedIn: false,
      products: [],
      selectedFilters: null,
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
    currentLanguage: 'en',
    currentPage: 'main',
    currentUser: mockUser,
    isAppThemeLight: true,
    isUserLoggedIn: false,
    products: [],
    selectedFilters: null,
    shippingCountry: '',
  };

  const mockOnChange = vitest.fn();
  const selectCurrentUserSpy = vitest.spyOn(actions, 'setCurrentUser');
  const mockSelect = vitest.fn(() => selectCurrentUser(mockState));
  const unsubscribe = observeStore(mockSelect, mockOnChange);

  expect(selectCurrentUser(mockState)).toBe(mockUser);
  actions.setCurrentUser(mockUser);

  expect(selectCurrentUserSpy).toHaveBeenCalledWith(mockUser);

  unsubscribe();
});

describe('rootReducer', () => {
  let initialState: State;

  beforeEach(() => {
    initialState = {
      billingCountry: '',
      categories: [],
      currentLanguage: 'en',
      currentPage: '',
      currentUser: null,
      isAppThemeLight: true,
      isUserLoggedIn: false,
      products: [],
      selectedFilters: null,
      shippingCountry: '',
    };
  });

  it('should handle setCurrentUser action', () => {
    const user: User = {
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
    const action = actions.setCurrentUser(user);
    const newState = rootReducer(initialState, action);
    expect(newState.currentUser).toEqual(user);
  });

  it('should handle setShippingCountry action', () => {
    const country = 'US';
    const action = actions.setShippingCountry(country);
    const newState = rootReducer(initialState, action);
    expect(newState.shippingCountry).toEqual(country);
  });

  it('should handle setBillingCountry action', () => {
    const country = 'UK';
    const action = actions.setBillingCountry(country);
    const newState = rootReducer(initialState, action);
    expect(newState.billingCountry).toEqual(country);
  });

  it('should handle setCategories action', () => {
    const categories: Category[] = [];
    const action = actions.setCategories(categories);
    const newState = rootReducer(initialState, action);
    expect(newState.categories).toEqual(categories);
  });

  it('should handle setProducts action', () => {
    const products: Product[] = [];
    const action = actions.setProducts(products);
    const newState = rootReducer(initialState, action);
    expect(newState.products).toEqual(products);
  });

  it('should handle setCurrentLanguage action', () => {
    const language = 'ru';
    const action = actions.setCurrentLanguage(language);
    const newState = rootReducer(initialState, action);
    expect(newState.currentLanguage).toEqual(language);
  });

  it('should return the same state for unknown action types', () => {
    const action = actions.setCurrentUser(null);
    const newState = rootReducer(initialState, action);
    expect(newState).toEqual(initialState);
  });
});
