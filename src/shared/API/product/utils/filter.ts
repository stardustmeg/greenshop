import { MAX_PRICE, MIN_PRICE, PRICE_FRACTIONS } from '@/shared/constants/product.ts';

import type { FilterFieldsType, PriceRange } from '../../types/type.ts';

import { FilterFields } from '../../types/type.ts';

export default class FilterProduct {
  private categories: string[] = [];

  private id: string[] = [];

  private newArrival = '';

  private price: PriceRange = {
    max: MAX_PRICE,
    min: MIN_PRICE,
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

  public getFilter(): string[] {
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
      // `${field}: range(${value.min * PRICE_FRACTIONS} to ${value.max * PRICE_FRACTIONS})`;
      result.push(
        `${FilterFields.PRICE}: range(${Math.round(this.price.min * PRICE_FRACTIONS)} to ${Math.round(this.price.max * PRICE_FRACTIONS)})`,
      );
    }
    if (this.sale) {
      result.push(this.sale);
    }
    return result;
  }

  public getPriceRange(): PriceRange {
    return this.price;
  }
}
