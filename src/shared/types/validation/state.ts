import type { State } from '../../Store/reducer.ts';

import { isUser } from './user.ts';

const isValidState = (state: unknown): state is State =>
  typeof state === 'object' &&
  state !== null &&
  'billingCountry' in state &&
  'categories' in state &&
  'currentLanguage' in state &&
  'currentPage' in state &&
  'currentUser' in state &&
  'isAppThemeLight' in state &&
  'isUserLoggedIn' in state &&
  'products' in state &&
  'selectedFilters' in state &&
  'shippingCountry' in state &&
  typeof state.billingCountry === 'string' &&
  Array.isArray(state.categories) &&
  state.categories.every((category: unknown) => typeof category === 'object') &&
  (state.currentLanguage === 'en' || state.currentLanguage === 'ru') &&
  typeof state.currentPage === 'string' &&
  isUser(state.currentUser) &&
  typeof state.isAppThemeLight === 'boolean' &&
  typeof state.isUserLoggedIn === 'boolean' &&
  Array.isArray(state.products) &&
  state.products.every((product: unknown) => typeof product === 'object') &&
  (state.selectedFilters === null || typeof state.selectedFilters === 'object') &&
  typeof state.shippingCountry === 'string';

export default isValidState;
