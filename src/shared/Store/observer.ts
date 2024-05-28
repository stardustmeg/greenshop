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

export const selectBillingCountry = (state: State): string => state.billingCountry;

export const selectShippingCountry = (state: State): string => state.shippingCountry;

export const selectCurrentLanguage = (state: State): string => state.currentLanguage;

export const selectIsUserLoggedIn = (state: State): boolean => state.isUserLoggedIn;

export const selectCurrentPage = (state: State): null | string => state.currentPage;

export default observeStore;
