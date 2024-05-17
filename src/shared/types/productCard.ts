import type { Variant, localization } from './product';

interface ProductCardParams {
  description: localization[];
  id: string;
  images: string[];
  key: string;
  name: localization[];
  variant: Variant[];
}

export default ProductCardParams;
