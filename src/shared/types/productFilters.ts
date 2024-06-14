import type { PriceRange, SizeProductCount } from '../API/types/type.ts';
import type { MetaFilterKeyType } from '../constants/filters.ts';
import type { Category, Product } from './product.ts';

interface ProductFiltersParams {
  categoriesProductCount:
    | {
        category: Category;
        count: number;
      }[]
    | null;
  priceRange: PriceRange | null;
  products: Product[] | null;
  sizes: SizeProductCount[] | null;
  totalProductCount: number;
}

export interface SelectedFilters {
  category: Set<string>;
  metaFilter: MetaFilterKeyType;
  price: {
    max: number;
    min: number;
  } | null;
  size: null | string;
}

export default ProductFiltersParams;
