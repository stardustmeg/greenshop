import type { Category, Product } from './product.ts';

interface ProductFiltersParams {
  categories: Category[];
  products: Product[];
}

export interface SelectedFilters {
  category: Set<string>;
}

export default ProductFiltersParams;
