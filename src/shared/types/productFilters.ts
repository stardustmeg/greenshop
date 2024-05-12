import type { SizeProductCount } from '../API/types/type.ts';
import type { Category, Product } from './product.ts';

interface ProductFiltersParams {
  categories: Category[] | null;
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
  price: {
    max: number;
    min: number;
  } | null;
  size: null | string;
}

export default ProductFiltersParams;
