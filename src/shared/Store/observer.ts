import type { PriceRange } from '../API/types/type.ts';
import type { MetaFiltersType } from '../constants/filters.ts';
import type { User } from '../types/user.ts';
import type { State } from './reducer.ts';

import getStore from './Store.ts';

function observeStore<T>(select: (state: State) => T, onChange: (selectedState: T) => void): VoidFunction {
  let currentState = select(getStore().getState());

  function handleChange(): void {
    const nextState = select(getStore().getState());
    if (JSON.stringify(nextState) !== JSON.stringify(currentState)) {
      currentState = nextState;
      onChange(currentState);
    }
  }

  const unsubscribe = getStore().subscribe(handleChange);
  return unsubscribe;
}

export function observeSetInStore<T>(select: (state: State) => T, onChange: (selectedState: T) => void): VoidFunction {
  let currentState = select(getStore().getState());
  function handleChange(): void {
    const nextState = select(getStore().getState());
    if (isSet(currentState) && isSet(nextState) && !setsHaveEqualContent(currentState, nextState)) {
      currentState = nextState;
      onChange(currentState);
    }
  }

  const unsubscribe = getStore().subscribe(handleChange);
  return unsubscribe;
}

export function isSet<T>(value: unknown): value is Set<T> {
  return value instanceof Set;
}

export function setsHaveEqualContent<T>(setA: Set<T>, setB: Set<T>): boolean {
  if (setA.size !== setB.size) {
    return false;
  }

  const sortedA = Array.from(setA).sort();
  const sortedB = Array.from(setB).sort();

  return sortedA.every((value, index) => value === sortedB[index]);
}

export const selectCurrentUser = (state: State): User | null => state.currentUser;

export const selectBillingCountry = (state: State): string => state.billingCountry;

export const selectShippingCountry = (state: State): string => state.shippingCountry;

export const selectCurrentLanguage = (state: State): string => state.currentLanguage;

export const selectIsUserLoggedIn = (state: State): boolean => state.isUserLoggedIn;

export const selectCurrentPage = (state: State): string => state.currentPage;

export const selectSelectedFiltersCategory = (state: State): Set<string> | null => {
  if (state.selectedFilters) {
    return state.selectedFilters.category;
  }
  return null;
};

export const selectSelectedFiltersPrice = (state: State): PriceRange | null => {
  if (state.selectedFilters) {
    return state.selectedFilters.price;
  }
  return null;
};

export const selectSelectedFiltersSize = (state: State): null | string => {
  if (state.selectedFilters) {
    return state.selectedFilters.size;
  }
  return null;
};

export const selectSelectedFiltersMetaFilter = (state: State): MetaFiltersType | null => {
  if (state.selectedFilters) {
    return state.selectedFilters.metaFilter;
  }
  return null;
};

export const selectSelectedSortingField = (state: State): null | string => {
  if (state.selectedSorting) {
    return state.selectedSorting.field;
  }
  return null;
};

export const selectSelectedSortingDirection = (state: State): null | string => {
  if (state.selectedSorting) {
    return state.selectedSorting.direction;
  }
  return null;
};

export const selectSearchValue = (state: State): string => state.searchValue;

export default observeStore;
