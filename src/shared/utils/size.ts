import type { SizeType } from '../types/product.ts';

import { SIZE } from '../types/product.ts';

export default function getSize(sizeString: string): SizeType | null {
  const sizeValues = Object.values(SIZE);

  const foundValue = sizeValues.find((value) => value.toLowerCase() === sizeString.toLowerCase());

  if (foundValue) {
    return foundValue;
  }

  return null;
}
