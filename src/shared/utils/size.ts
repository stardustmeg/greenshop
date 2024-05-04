import { Size } from '../types/product.ts';

export default function getSize(sizeString: string): Size | null {
  const sizeValues = Object.values(Size);

  const foundValue = sizeValues.find((value) => value.toLowerCase() === sizeString.toLowerCase());

  if (foundValue) {
    return foundValue;
  }

  return null;
}
