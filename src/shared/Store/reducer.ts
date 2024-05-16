/* eslint-disable max-lines-per-function */
import type { TokenStore } from '@commercetools/sdk-client-v2';

import type { LanguageChoiceType } from '../constants/common.ts';
import type { PageIdType } from '../constants/pages.ts';
import type { SelectedFilters } from '../types/productFilters.ts';
import type { SelectedSorting } from '../types/productSorting.ts';
import type { User } from '../types/user.ts';
import type * as actions from './actions.ts';
import type { Reducer } from './types.ts';

export interface State {
  anonymToken: TokenStore | null;
  anonymousCartId: null | string;
  anonymousId: null | string;
  authToken: TokenStore | null;
  billingCountry: string;
  currentLanguage: LanguageChoiceType;
  currentPage: PageIdType;
  currentUser: User | null;
  isAppThemeLight: boolean;
  isUserLoggedIn: boolean;
  selectedFilters: SelectedFilters | null;
  selectedSorting: SelectedSorting | null;
  shippingCountry: string;
}

type InferValueTypes<T> = T extends { [key: string]: infer U } ? U : never;

export type Action = ReturnType<InferValueTypes<typeof actions>>;
export const rootReducer: Reducer<State, Action> = (state: State, action: Action): State => {
  switch (action.type) {
    case 'setAnonymToken':
      return {
        ...state,
        anonymToken: action.payload,
      };
    case 'setAuthToken':
      return {
        ...state,
        authToken: action.payload,
      };
    case 'setAnonymousCartId':
      return {
        ...state,
        anonymousCartId: action.payload,
      };
    case 'setAnonymousId':
      return {
        ...state,
        anonymousId: action.payload,
      };
    case 'setCurrentUser':
      return {
        ...state,
        currentUser: action.payload,
      };
    case 'setShippingCountry':
      return {
        ...state,
        shippingCountry: action.payload,
      };
    case 'setBillingCountry':
      return {
        ...state,
        billingCountry: action.payload,
      };
    case 'setCurrentLanguage':
      return {
        ...state,
        currentLanguage: action.payload,
      };
    case 'switchIsUserLoggedIn':
      return {
        ...state,
        isUserLoggedIn: action.payload,
      };
    case 'setCurrentPage':
      return {
        ...state,
        currentPage: action.payload,
      };
    case 'switchAppTheme':
      return {
        ...state,
        isAppThemeLight: !state.isAppThemeLight,
      };
    case 'setSelectedFilters':
      return {
        ...state,
        selectedFilters: action.payload,
      };
    case 'setSelectedSorting':
      return {
        ...state,
        selectedSorting: action.payload,
      };
    default:
      return state;
  }
};
