import type MetaFilters from '../types/productFilters.ts';

const isKeyOfMetaFilters = (context: MetaFilters, key: string): key is keyof MetaFilters => key in context;

export default isKeyOfMetaFilters;
