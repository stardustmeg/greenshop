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

export const selectCurrentUser = (state: State): User | null => state.currentUser;

export const selectBillingCountry = (state: State): string => state.billingCountry;

export const selectShippingCountry = (state: State): string => state.shippingCountry;

export default observeStore;
