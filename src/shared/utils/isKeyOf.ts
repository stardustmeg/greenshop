import type MetaFilters from '../types/productFilters.ts';
import type { UserCredentials } from '../types/user';

export const isKeyOfUserData = (context: UserCredentials, key: string): key is keyof UserCredentials =>
  Object.hasOwnProperty.call(context, key);

export const isKeyOfMetaFilters = (context: MetaFilters, key: string): key is keyof MetaFilters => key in context;
