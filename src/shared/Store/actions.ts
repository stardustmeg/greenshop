import type { TokenStore } from '@commercetools/sdk-client-v2';

import type { LanguageChoiceType } from '../constants/common.ts';
import type { PageIdType } from '../constants/pages.ts';

const ACTION = {
  SET_ANONYM_TOKEN: 'setAnonymToken',
  SET_ANONYMOUS_CART_ID: 'setAnonymousCartId',
  SET_ANONYMOUS_ID: 'setAnonymousId',
  SET_AUTH_TOKEN: 'setAuthToken',
  SET_BILLING_COUNTRY: 'setBillingCountry',
  SET_CURRENT_LANGUAGE: 'setCurrentLanguage',
  SET_CURRENT_PAGE: 'setCurrentPage',
  SET_SHIPPING_COUNTRY: 'setShippingCountry',
  SWITCH_APP_THEME: 'switchAppTheme',
  SWITCH_IS_USER_LOGGED_IN: 'switchIsUserLoggedIn',
} as const;

export type ActionType = (typeof ACTION)[keyof typeof ACTION];

interface ActionWithPayload<T, U extends ActionType> {
  payload: T;
  type: U;
}

interface ActionWithoutPayload<U extends ActionType> {
  type: U;
}

export const setAnonymToken = (
  value: TokenStore | null,
): ActionWithPayload<TokenStore | null, typeof ACTION.SET_ANONYM_TOKEN> => ({
  payload: value,
  type: ACTION.SET_ANONYM_TOKEN,
});

export const setAuthToken = (
  value: TokenStore | null,
): ActionWithPayload<TokenStore | null, typeof ACTION.SET_AUTH_TOKEN> => ({
  payload: value,
  type: ACTION.SET_AUTH_TOKEN,
});

export const setAnonymousCartId = (
  value: null | string,
): ActionWithPayload<null | string, typeof ACTION.SET_ANONYMOUS_CART_ID> => ({
  payload: value,
  type: ACTION.SET_ANONYMOUS_CART_ID,
});

export const setAnonymousId = (
  value: null | string,
): ActionWithPayload<null | string, typeof ACTION.SET_ANONYMOUS_ID> => ({
  payload: value,
  type: ACTION.SET_ANONYMOUS_ID,
});

export const setBillingCountry = (value: string): ActionWithPayload<string, typeof ACTION.SET_BILLING_COUNTRY> => ({
  payload: value,
  type: ACTION.SET_BILLING_COUNTRY,
});

export const setShippingCountry = (value: string): ActionWithPayload<string, typeof ACTION.SET_SHIPPING_COUNTRY> => ({
  payload: value,
  type: ACTION.SET_SHIPPING_COUNTRY,
});

export const setCurrentLanguage = (
  value: LanguageChoiceType,
): ActionWithPayload<LanguageChoiceType, typeof ACTION.SET_CURRENT_LANGUAGE> => ({
  payload: value,
  type: ACTION.SET_CURRENT_LANGUAGE,
});

export const switchIsUserLoggedIn = (
  value: boolean,
): ActionWithPayload<boolean, typeof ACTION.SWITCH_IS_USER_LOGGED_IN> => ({
  payload: value,
  type: ACTION.SWITCH_IS_USER_LOGGED_IN,
});

export const setCurrentPage = (
  value: PageIdType | null,
): ActionWithPayload<PageIdType | null, typeof ACTION.SET_CURRENT_PAGE> => ({
  payload: value,
  type: ACTION.SET_CURRENT_PAGE,
});

export const switchAppTheme = (): ActionWithoutPayload<typeof ACTION.SWITCH_APP_THEME> => ({
  type: ACTION.SWITCH_APP_THEME,
});
