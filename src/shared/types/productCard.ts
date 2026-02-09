import type { Category, Variant, localization } from './product';

interface ProductCardParams {
  category: Category[];
  description: localization[];
  id: string;
  images: string[];
  key: string;
  name: localization[];
  variant: Variant[];
}

export default ProductCardParams;
