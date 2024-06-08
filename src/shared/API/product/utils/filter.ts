import { MAX_PRICE, MIN_PRICE, PRICE_FRACTIONS } from '@/shared/constants/product.ts';

import type { FilterFieldsType, PriceRange } from '../../types/type.ts';

import { FilterFields } from '../../types/type.ts';

export default class FilterProduct {
  private categories: string[] = [];

  private id: string[] = [];

  private newArrival = '';

  private price: PriceRange = {
    max: 0,
    min: 0,
  };

  private sale = '';

  private size: string[] = [];

  public addFilter(field: FilterFieldsType, value?: PriceRange | string): string[] {
    switch (field) {
      case FilterFields.ID:
        if (typeof value === 'string') {
          this.id.push(value);
        }
        break;
      case FilterFields.CATEGORY:
        if (typeof value === 'string') {
          this.categories.push(value);
        }
        break;
      case FilterFields.NEW_ARRIVAL:
        this.newArrival = field;
        break;
      case FilterFields.SALE:
        this.sale = field;
        break;
      case FilterFields.SIZE:
        if (typeof value === 'string') {
          this.size.push(value);
        }
        break;
      case FilterFields.PRICE:
        if (value && typeof value !== 'string') {
          this.price.max = value.max;
          this.price.min = value.min;
        }
        break;
      default:
        break;
    }
    return this.getFilter();
  }

  public getFilter(productsPriceRange?: PriceRange): string[] {
    const result = [];
    if (this.id.length) {
      result.push(`${FilterFields.ID}:${this.id.map((id) => `"${id}"`).join(',')}`);
    }
    if (this.categories.length) {
      result.push(`${FilterFields.CATEGORY}:${this.categories.map((category) => `subtree("${category}")`).join(',')}`);
    }
    if (this.size.length) {
      result.push(`${FilterFields.SIZE}:${this.size.map((size) => `"${size}"`).join(',')}`);
    }
    if (this.newArrival) {
      result.push(this.newArrival);
    }
    if (this.price) {
      result.push(this.getPriceRange(productsPriceRange));
    }
    if (this.sale) {
      result.push(this.sale);
    }
    return result;
  }

  public getPriceRange(productsPriceRange?: PriceRange): string {
    const min = Math.round(this.price.min * PRICE_FRACTIONS);
    const max =
      this.price.max && productsPriceRange && this.price.max !== productsPriceRange.max
        ? Math.round(this.price.max * PRICE_FRACTIONS)
        : MAX_PRICE;

    return `${FilterFields.PRICE}: range(${min} to ${max})`;
  }
}

export function getDefaultPriceRange(): string {
  return `${FilterFields.PRICE}: range(${MIN_PRICE} to ${MAX_PRICE})`;
}
