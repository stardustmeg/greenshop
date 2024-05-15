import type { LanguageChoiceType } from '../constants/common.ts';
import type { PageIdType } from '../constants/pages.ts';
import type { SelectedFilters } from '../types/productFilters';
import type { SelectedSorting } from '../types/productSorting.ts';
import type { User } from '../types/user';

const ACTION = {
  SET_ANONYMOUS_CART_ID: 'setAnonymousCartId',
  SET_ANONYMOUS_ID: 'setAnonymousId',
  SET_BILLING_COUNTRY: 'setBillingCountry',
  SET_CURRENT_LANGUAGE: 'setCurrentLanguage',
  SET_CURRENT_PAGE: 'setCurrentPage',
  SET_CURRENT_USER: 'setCurrentUser',
  SET_SELECTED_FILTERS: 'setSelectedFilters',
  SET_SELECTED_SORTING: 'setSelectedSorting',
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

export const setCurrentUser = (value: User | null): ActionWithPayload<User | null, typeof ACTION.SET_CURRENT_USER> => ({
  payload: value,
  type: ACTION.SET_CURRENT_USER,
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

export const setCurrentPage = (value: PageIdType): ActionWithPayload<PageIdType, typeof ACTION.SET_CURRENT_PAGE> => ({
  payload: value,
  type: ACTION.SET_CURRENT_PAGE,
});

export const switchAppTheme = (): ActionWithoutPayload<typeof ACTION.SWITCH_APP_THEME> => ({
  type: ACTION.SWITCH_APP_THEME,
});

export const setSelectedFilters = (
  value: SelectedFilters | null,
): ActionWithPayload<SelectedFilters | null, typeof ACTION.SET_SELECTED_FILTERS> => ({
  payload: value,
  type: ACTION.SET_SELECTED_FILTERS,
});

export const setSelectedSorting = (
  value: SelectedSorting | null,
): ActionWithPayload<SelectedSorting | null, typeof ACTION.SET_SELECTED_SORTING> => ({
  payload: value,
  type: ACTION.SET_SELECTED_SORTING,
});
