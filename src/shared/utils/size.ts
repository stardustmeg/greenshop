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

export function getLevel(level: number | string): LevelType | null {
  const normalized = level.toString().toLowerCase();

  return Object.values(LEVEL).find((value) => value.toLowerCase() === normalized) ?? null;
}
