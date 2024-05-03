/* eslint-disable max-lines-per-function */
import type { User } from '../types/user.ts';
import type * as actions from './actions.ts';
import type { Reducer } from './types.ts';

export interface State {
  currentUser: User | null;
  registerFormCountry: string;
}

type InferValueTypes<T> = T extends { [key: string]: infer U } ? U : never;

export type Action = ReturnType<InferValueTypes<typeof actions>>;
export const rootReducer: Reducer<State, Action> = (state: State, action: Action): State => {
  switch (action.type) {
    case 'setCurrentUser':
      return {
        ...state,
        currentUser: action.payload,
      };
    case 'setRegisterFormCountry':
      return {
        ...state,
        registerFormCountry: action.payload,
      };
    default:
      return state;
  }
};
