import type { PriceRange } from '../../types/type.ts';

import { FilterFields } from '../../types/type.ts';
import FilterProduct from '../utils/filter.ts';

/**
 * @vitest-environment jsdom
 */

describe('Checking filter', () => {
  const filter = new FilterProduct();
  it('should check if FilterProduct is defined', () => {
    expect(filter).toBeDefined();
  });

  it('should check if filter is an instance of FilterProduct', () => {
    expect(filter).toBeInstanceOf(FilterProduct);
  });

  it('should return category filter', () => {
    const filter = new FilterProduct();
    filter.addFilter(FilterFields.CATEGORY, 'id');
    const result = filter.getFilter();
    expect(result).toEqual(['categories.id:subtree("id")', 'variants.price.centAmount: range(0 to *)']);
  });

  it('should return product filter', () => {
    const filter = new FilterProduct();
    filter.addFilter(FilterFields.ID, 'id');
    const result = filter.getFilter();
    expect(result).toEqual(['id:"id"', 'variants.price.centAmount: range(0 to *)']);
  });

  it('should return new_arrival filter', () => {
    const filter = new FilterProduct();
    filter.addFilter(FilterFields.NEW_ARRIVAL, 'true');
    const result = filter.getFilter();
    expect(result).toEqual(['variants.attributes.new_arrival:true', 'variants.price.centAmount: range(0 to *)']);
  });

  it('should return price filter', () => {
    const filter = new FilterProduct();
    const priceMinMax: PriceRange = {
      max: 160,
      min: 0,
    };
    const price: PriceRange = {
      max: 10,
      min: 5,
    };
    filter.addFilter(FilterFields.PRICE, price);
    const result = filter.getFilter(priceMinMax);
    expect(result).toEqual(['variants.price.centAmount: range(500 to 1000)']);
  });

  it('should return sale filter', () => {
    const filter = new FilterProduct();
    filter.addFilter(FilterFields.SALE, 'true');
    const result = filter.getFilter();
    expect(result).toEqual(['variants.price.centAmount: range(0 to *)', 'variants.prices.discounted:exists']);
  });

  it('should return sale filter', () => {
    const filter = new FilterProduct();
    filter.addFilter(FilterFields.SIZE, 'M');
    const result = filter.getFilter();
    expect(result).toEqual(['variants.attributes.size.key:"M"', 'variants.price.centAmount: range(0 to *)']);
  });
});
