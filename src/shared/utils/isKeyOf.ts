import type MetaFilters from '../types/productFilters.ts';
import type { UserCredentials } from '../types/user';

import getStore from '../Store/Store.ts';
import { PAGE_TITLE } from '../constants/pages.ts';

export const isKeyOfUserData = (context: UserCredentials, key: string): key is keyof UserCredentials =>
  Object.hasOwnProperty.call(context, key);

export const isKeyOfMetaFilters = (context: MetaFilters, key: string): key is keyof MetaFilters => key in context;

export const keyExistsInPageTitle = (key: string): boolean => key in PAGE_TITLE[getStore().getState().currentLanguage];
