import type { Category, Product } from './product.ts';

interface ProductFiltersParams {
  categories: Category[] | null;
  priceRange: {
    max: number;
    min: number;
  } | null;
  products: Product[] | null;
}

export interface SelectedFilters {
  category: Set<string>;
  price: {
    max: number;
    min: number;
  } | null;
}

export default ProductFiltersParams;
