import type MetaFilters from '../types/productFilters.ts';
import type { UserCredentials } from '../types/user';

import { TEXT_KEYS, type TextKeysType } from '../constants/sorting.ts';

export const isKeyOfUserData = (context: UserCredentials, key: string): key is keyof UserCredentials =>
  Object.hasOwnProperty.call(context, key);

export const isKeyOfMetaFilters = (context: MetaFilters, key: string): key is keyof MetaFilters => key in context;

export const isKeyOfSortField = (key: string): key is TextKeysType => key in TEXT_KEYS;
