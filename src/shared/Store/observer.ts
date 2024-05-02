import type { UserInterface } from '../types/interfaces.ts';
import type { State } from './reducer.ts';

import getStore from './Store.ts';

function observeStore<T>(select: (state: State) => T, onChange: (selectedState: T) => void): VoidFunction {
  let currentState = select(getStore().getState());

  function handleChange(): void {
    const nextState = select(getStore().getState());
    if (nextState !== currentState) {
      currentState = nextState;
      onChange(currentState);
    }
  }

  const unsubscribe = getStore().subscribe(handleChange);
  return unsubscribe;
}

export const selectCurrentUser = (state: State): UserInterface | null => state.currentUser;

export default observeStore;
