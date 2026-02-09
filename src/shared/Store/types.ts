interface ReduxStore<S, A> {
  dispatch(action: A): A;
  getState(): S;
  subscribe(listener: VoidFunction): VoidFunction;
}

type Reducer<S, A> = (state: S, action: A) => S;

export type { Reducer, ReduxStore };
