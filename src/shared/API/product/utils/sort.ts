import type { SortOptions } from '../../types/type.ts';

export default function makeSortRequest(sortOptions: SortOptions): string {
  return `${sortOptions.field}${sortOptions.locale ? `.${sortOptions.locale}` : ''} ${sortOptions.direction}`;
}
