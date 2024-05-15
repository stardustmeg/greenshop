/* eslint-disable max-lines-per-function */
import type { LanguageChoiceType } from '../constants/buttons.ts';
import type { PageIdType } from '../constants/pages.ts';
import type { SelectedFilters } from '../types/productFilters.ts';
import type { User } from '../types/user.ts';
import type * as actions from './actions.ts';
import type { Reducer } from './types.ts';

export interface State {
  anonymousCartId: null | string;
  anonymousId: null | string;
  billingCountry: string;
  currentLanguage: LanguageChoiceType;
  currentPage: PageIdType;
  currentUser: User | null;
  isAppThemeLight: boolean;
  isUserLoggedIn: boolean;
  selectedFilters: SelectedFilters | null;
  shippingCountry: string;
}

type InferValueTypes<T> = T extends { [key: string]: infer U } ? U : never;

export type Action = ReturnType<InferValueTypes<typeof actions>>;
export const rootReducer: Reducer<State, Action> = (state: State, action: Action): State => {
  switch (action.type) {
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
    default:
      return state;
  }
};
