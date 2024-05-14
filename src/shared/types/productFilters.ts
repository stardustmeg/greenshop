import type { SizeProductCount } from '../API/types/type.ts';
import type { MetaFiltersType } from '../constants/filters.ts';
import type { Category, Product } from './product.ts';

interface ProductFiltersParams {
  categoriesProductCount:
    | {
        category: Category;
        count: number;
      }[]
    | null;
  priceRange: {
    max: number;
    min: number;
  } | null;
  products: Product[] | null;
  sizes: SizeProductCount[] | null;
}

export interface SelectedFilters {
  category: Set<string>;
  metaFilter: MetaFiltersType;
  price: {
    max: number;
    min: number;
  } | null;
  size: null | string;
}

export default ProductFiltersParams;
