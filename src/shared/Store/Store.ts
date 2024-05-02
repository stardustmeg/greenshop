/* eslint-disable @typescript-eslint/consistent-type-assertions */

import type { Action, State } from './reducer.ts';
import type { Reducer, ReduxStore } from './types';

import { EVENT_NAMES, initialState } from '../constants/enums.ts';
import { STORAGE_KEY, saveCurrentStateToLocalStorage } from '../services/localStorage.ts';
import { rootReducer } from './reducer.ts';

export class Store<S, A> implements ReduxStore<S, A> {
  private listeners: VoidFunction[] = [];

  private rootReducer: Reducer<S, A>;

  private state: S;

  constructor(initialData: S, rootReducer: Reducer<S, A>) {
    const storedData: null | string = localStorage.getItem(STORAGE_KEY);

    let stateToSet: S;

    if (storedData) {
      stateToSet = structuredClone(JSON.parse(storedData) as S);
    } else {
      stateToSet = initialData;
    }

    this.state = structuredClone(stateToSet);
    this.rootReducer = rootReducer;

    window.addEventListener(EVENT_NAMES.BEFOREUNLOAD, () => saveCurrentStateToLocalStorage(this.state));
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
