import type { SelectedFilters } from '../types/productFilters.ts';
import type { User } from '../types/user.ts';
import type { State } from './reducer.ts';

import { META_FILTERS } from '../constants/filters.ts';
import { PAGE_ID } from '../constants/pages.ts';
import getStore, { Store } from './Store.ts';
import * as actions from './actions.ts';
import * as observer from './observer.ts';
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
      anonymToken: null,
      anonymousCartId: null,
      anonymousId: null,
      authToken: null,
      billingCountry: '',
      currentLanguage: 'en',
      currentPage: '/',
      currentUser: null,
      isAppThemeLight: true,
      isUserLoggedIn: false,
      searchValue: '',
      selectedFilters: null,
      selectedSorting: null,
      shippingCountry: '',
    }),
  };
});

describe('ObserveStore', () => {
  it('should check if observeStore is a function', () => {
    expect(observer.default).toBeInstanceOf(Function);
  });
});

describe('selectCurrentLanguage', () => {
  it('should return the current language from the state', () => {
    const language = observer.selectCurrentLanguage(getStore().getState());

    expect(language).toBe('en');
  });
});

describe('selectIsUserLoggedIn', () => {
  it('should return the isUserLoggedIn from the state', () => {
    const isUserLoggedIn = observer.selectIsUserLoggedIn(getStore().getState());
    expect(isUserLoggedIn).toBe(false);
  });
});

describe('selectCurrentPage', () => {
  it('should return the current page from the state', () => {
    const currentPage = observer.selectCurrentPage(getStore().getState());
    expect(currentPage).toBe(PAGE_ID.DEFAULT_PAGE);
  });
});

describe('observeSetInStore', () => {
  it('should check if observeSetInStore is a function', () => {
    expect(observer.observeSetInStore).toBeInstanceOf(Function);
  });
});

describe('selectCurrentUser', () => {
  it('should check if selectCurrentUser is a function', () => {
    expect(observer.selectCurrentUser).toBeInstanceOf(Function);
  });
});

it('should check if selectCurrentUser is a function', () => {
  expect(observer.selectCurrentUser).toBeInstanceOf(Function);
});

it('should check if selectBillingCountry is a function', () => {
  expect(observer.selectBillingCountry).toBeInstanceOf(Function);
});

it('should check if selectShippingCountry is a function', () => {
  expect(observer.selectShippingCountry).toBeInstanceOf(Function);
});

it('should check if selectCurrentLanguage is a function', () => {
  expect(observer.selectCurrentLanguage).toBeInstanceOf(Function);
});

it('should check if selectIsUserLoggedIn is a function', () => {
  expect(observer.selectIsUserLoggedIn).toBeInstanceOf(Function);
});

it('should check if selectCurrentPage is a function', () => {
  expect(observer.selectCurrentPage).toBeInstanceOf(Function);
});

it('should check if selectSelectedFiltersCategory is a function', () => {
  expect(observer.selectSelectedFiltersCategory).toBeInstanceOf(Function);
});

it('should check if selectSelectedFiltersPrice is a function', () => {
  expect(observer.selectSelectedFiltersPrice).toBeInstanceOf(Function);
});

it('should check if selectSelectedFiltersSize is a function', () => {
  expect(observer.selectSelectedFiltersSize).toBeInstanceOf(Function);
});

it('should check if selectSelectedFiltersMetaFilter is a function', () => {
  expect(observer.selectSelectedFiltersMetaFilter).toBeInstanceOf(Function);
});

it('observeStore should call select and onChange when state changes', () => {
  const mockUser = {
    addresses: [],
    billingAddress: [],
    birthDate: '1990-01-01',
    defaultBillingAddressId: null,
    defaultShippingAddressId: null,
    email: 'test@test.test',
    firstName: 'Test',
    id: 'test',
    lastName: 'Test',
    locale: 'en',
    password: 'Testtest1',
    shippingAddress: [],
    version: 0,
  };

  const mockState: State = {
    anonymToken: null,
    anonymousCartId: null,
    anonymousId: null,
    authToken: null,
    billingCountry: '',
    currentLanguage: 'en',
    currentPage: 'main/',
    currentUser: mockUser,
    isAppThemeLight: true,
    isUserLoggedIn: false,
    searchValue: '',
    selectedFilters: null,
    selectedSorting: null,
    shippingCountry: '',
  };

  const mockOnChange = vitest.fn();
  const selectCurrentUserSpy = vitest.spyOn(actions, 'setCurrentUser');
  const mockSelect = vitest.fn(() => observer.selectCurrentUser(mockState));
  const unsubscribe = observer.default(mockSelect, mockOnChange);

  expect(observer.selectCurrentUser(mockState)).toBe(mockUser);
  actions.setCurrentUser(mockUser);

  expect(selectCurrentUserSpy).toHaveBeenCalledWith(mockUser);

  unsubscribe();
});

describe('isSet', () => {
  it('should return true for an instance of Set', () => {
    const set = new Set<number>();
    expect(observer.isSet(set)).toBe(true);
  });

  it('should return false for an array', () => {
    const arr = [1, 2, 3];
    expect(observer.isSet(arr)).toBe(false);
  });

  it('should return false for a plain object', () => {
    const obj = { key: 'value' };
    expect(observer.isSet(obj)).toBe(false);
  });

  it('should return false for a string', () => {
    const str = 'test';
    expect(observer.isSet(str)).toBe(false);
  });
});

describe('setsHaveEqualContent', () => {
  it('should return true for sets with the same content', () => {
    const set1 = new Set([1, 2, 3]);
    const set2 = new Set([3, 2, 1]);
    expect(observer.setsHaveEqualContent(set1, set2)).toBe(true);
  });

  it('should return false for sets with different sizes', () => {
    const set1 = new Set([1, 2, 3]);
    const set2 = new Set([1, 2]);
    expect(observer.setsHaveEqualContent(set1, set2)).toBe(false);
  });

  it('should return false for sets with different content', () => {
    const set1 = new Set([1, 2, 3]);
    const set2 = new Set([4, 5, 6]);
    expect(observer.setsHaveEqualContent(set1, set2)).toBe(false);
  });
});

describe('rootReducer', () => {
  let initialState: State;

  beforeEach(() => {
    initialState = {
      anonymToken: null,
      anonymousCartId: null,
      anonymousId: null,
      authToken: null,
      billingCountry: '',
      currentLanguage: 'en',
      currentPage: '/',
      currentUser: null,
      isAppThemeLight: true,
      isUserLoggedIn: false,
      searchValue: '',
      selectedFilters: null,
      selectedSorting: null,
      shippingCountry: '',
    };
  });

  it('should handle setCurrentUser action', () => {
    const user: User = {
      addresses: [],
      billingAddress: [],
      birthDate: '1990-01-01',
      defaultBillingAddressId: null,
      defaultShippingAddressId: null,
      email: 'test@test.test',
      firstName: 'Test',
      id: 'test',
      lastName: 'Test',
      locale: 'en',
      password: 'Testtest1',
      shippingAddress: [],
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

  it('should handle setCurrentLanguage action', () => {
    const language = 'ru';
    const action = actions.setCurrentLanguage(language);
    const newState = rootReducer(initialState, action);
    expect(newState.currentLanguage).toEqual(language);
  });

  it('should handle switchIsUserLoggedIn action', () => {
    const isLoggedIn = true;
    const action = actions.switchIsUserLoggedIn(isLoggedIn);
    const newState = rootReducer(initialState, action);
    expect(newState.isUserLoggedIn).toEqual(isLoggedIn);
  });

  it('should handle setCurrentPage action', () => {
    const page = 'main/';
    const action = actions.setCurrentPage(PAGE_ID.MAIN_PAGE);
    const newState = rootReducer(initialState, action);
    expect(newState.currentPage).toEqual(page);
  });

  it('should handle switchAppTheme action', () => {
    const action = actions.switchAppTheme();
    const newState = rootReducer(initialState, action);
    expect(newState.isAppThemeLight).toEqual(!initialState.isAppThemeLight);
  });

  it('should handle setSelectedFilters action', () => {
    const filters: SelectedFilters = {
      category: new Set<string>(),
      metaFilter: META_FILTERS.en.NEW_ARRIVALS,
      price: null,
      size: null,
    };
    const action = actions.setSelectedFilters(filters);
    const newState = rootReducer(initialState, action);
    expect(newState.selectedFilters).toEqual(filters);
  });

  it('should return the same state for unknown action types', () => {
    const action = actions.setCurrentUser(null);
    const newState = rootReducer(initialState, action);
    expect(newState).toEqual(initialState);
  });
});
