/* eslint-disable max-lines-per-function */
import type { TokenStore } from '@commercetools/sdk-client-v2';

import type { LanguageChoiceType } from '../constants/common.ts';
import type { PageIdType } from '../constants/pages.ts';
import type * as actions from './actions.ts';
import type { Reducer } from './types.ts';

export interface State {
  anonymousCartId: null | string;
  anonymousId: null | string;
  anonymousShopListId: null | string;
  anonymousToken: TokenStore | null;
  authToken: TokenStore | null;
  billingCountry: string;
  currentLanguage: LanguageChoiceType;
  currentPage: PageIdType | null;
  defaultCountry: string;
  isAppThemeLight: boolean;
  isUserLoggedIn: boolean;
  shippingCountry: string;
}

type InferValueTypes<T> = T extends { [key: string]: infer U } ? U : never;

export type Action = ReturnType<InferValueTypes<typeof actions>>;
export const rootReducer: Reducer<State, Action> = (state: State, action: Action): State => {
  switch (action.type) {
    case 'setanonymousToken':
      return {
        ...state,
        anonymousToken: action.payload,
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
    case 'setAnonymousShopListId':
      return {
        ...state,
        anonymousShopListId: action.payload,
      };
    case 'setAnonymousId':
      return {
        ...state,
        anonymousId: action.payload,
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
    case 'setDefaultCountry':
      return {
        ...state,
        defaultCountry: action.payload,
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
    default:
      return state;
  }
};
