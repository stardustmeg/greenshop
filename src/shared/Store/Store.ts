import type { Action, State } from './reducer.ts';
import type { Reducer, ReduxStore } from './types';

import { parseToLoad } from '../services/helper.ts';
import { STORAGE_KEY, saveCurrentStateToLocalStorage } from '../services/localStorage.ts';
import { setCurrentPage } from './actions.ts';
import initialState from './initialState.ts';
import { rootReducer } from './reducer.ts';

export class Store<S, A> implements ReduxStore<S, A> {
  private listeners: VoidFunction[] = [];

  private rootReducer: Reducer<S, A>;

  private state: S;

  constructor(initialData: S, rootReducer: Reducer<S, A>) {
    const storedData: null | string = localStorage.getItem(STORAGE_KEY);

    let stateToSet: S;

    if (storedData) {
      stateToSet = structuredClone(parseToLoad<S>(storedData));
    } else {
      stateToSet = initialData;
    }

    this.state = structuredClone(stateToSet);
    this.rootReducer = rootReducer;

    // If you have unexpected bugs related to State of the app, or you need to clear out Local Storage to start afresh, comment out the next line, go to the browser tab, clear out the storage manually, and update the page one more time. Then come back here and uncomment it
    window.addEventListener('beforeunload', () => {
      getStore().dispatch(setCurrentPage(null));
      saveCurrentStateToLocalStorage(this.state);
    });
  }

  public dispatch(action: A): A {
    this.state = this.rootReducer(this.state, action);
    this.listeners.forEach((listener) => {
      listener();
    });
    return action;
  }

  public getState(): S {
    return structuredClone(this.state);
  }

  public subscribe(listener: VoidFunction): VoidFunction {
    this.listeners.push(listener);

    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
}

const createStore = <S, A>(reducer: Reducer<S, A>, initialState: S): Store<S, A> =>
  new Store<S, A>(initialState, reducer);

const store = createStore<State, Action>(rootReducer, initialState);

export default function getStore(): Store<State, Action> {
  return store;
}
