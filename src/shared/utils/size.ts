import type { LevelType, SizeType } from '../types/product.ts';

import { LEVEL, SIZE } from '../types/product.ts';

export function getSize(sizeString: string): SizeType | null {
  const sizeValues = Object.values(SIZE);

  const foundValue = sizeValues.find((value) => value.toLowerCase() === sizeString.toLowerCase());

  if (foundValue) {
    return foundValue;
  }

  return null;
}

export function getLevel(levelString: string): LevelType | null {
  const levelValues = Object.values(LEVEL);

  const foundValue = levelValues.find((value) => value.toLowerCase() === levelString.toLowerCase());

  if (foundValue) {
    return foundValue;
  }

  return null;
}
