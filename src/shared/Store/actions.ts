import type { LanguageChoiceType } from '../constants/common.ts';
import type { PageIdType } from '../constants/pages.ts';
import type { Category, Product } from '../types/product';
import type { SelectedFilters } from '../types/productFilters';
import type { User } from '../types/user';

const ACTION = {
  SET_BILLING_COUNTRY: 'setBillingCountry',
  SET_CATEGORIES: 'setCategories',
  SET_CURRENT_LANGUAGE: 'setCurrentLanguage',
  SET_CURRENT_PAGE: 'setCurrentPage',
  SET_CURRENT_USER: 'setCurrentUser',
  SET_PRODUCTS: 'setProducts',
  SET_SELECTED_FILTERS: 'setSelectedFilters',
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

export const setCategories = (value: Category[]): ActionWithPayload<Category[], typeof ACTION.SET_CATEGORIES> => ({
  payload: value,
  type: ACTION.SET_CATEGORIES,
});

export const setProducts = (value: Product[]): ActionWithPayload<Product[], typeof ACTION.SET_PRODUCTS> => ({
  payload: value,
  type: ACTION.SET_PRODUCTS,
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
