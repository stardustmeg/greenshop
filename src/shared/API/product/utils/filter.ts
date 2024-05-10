import { PRICE_FRACTIONS } from '@/shared/constants/product.ts';

import type { FilterFieldsType, PriceRange } from '../../types/type.ts';

import { FilterFields } from '../../types/type.ts';

export default function addFilter(field: FilterFieldsType, value?: PriceRange | string): string {
  let result = '';
  switch (field) {
    case FilterFields.CATEGORY:
      if (typeof value === 'string') {
        result = `${field}:subtree("${value}")`;
      }
      break;
    case FilterFields.NEW_ARRIVAL:
      result = field;
      break;
    case FilterFields.SALE:
      result = field;
      break;
    case FilterFields.SIZE:
      if (typeof value === 'string') {
        result = `${field}:"${value}"`;
      }
      break;
    case FilterFields.PRICE:
      if (value && typeof value !== 'string') {
        result = `${field}: range(${value.min * PRICE_FRACTIONS} to ${value.max * PRICE_FRACTIONS})`;
      }
      break;
    default:
      result = '';
  }
  return result;
}
