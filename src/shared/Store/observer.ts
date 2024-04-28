import type { Action, State } from './reducer.ts';
import type { ReduxStore } from './types';

function observeStore<T>(
  store: ReduxStore<State, Action>,
  select: (state: State) => T,
  onChange: (selectedState: T) => void,
): VoidFunction {
  let currentState = select(store.getState());

  function handleChange(): void {
    const nextState = select(store.getState());
    if (nextState !== currentState) {
      currentState = nextState;
      onChange(currentState);
    }
  }

  const unsubscribe = store.subscribe(handleChange);
  return unsubscribe;
}

export default observeStore;
