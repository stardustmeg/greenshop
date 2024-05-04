/* eslint-disable max-lines-per-function */
import type { Category, Product } from '../types/product.ts';
import type { User } from '../types/user.ts';
import type * as actions from './actions.ts';
import type { Reducer } from './types.ts';

export interface State {
  billingCountry: string;
  categories: Category[];
  currentUser: User | null;
  products: Product[];
  shippingCountry: string;
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
    case 'setShippingCountry':
      return {
        ...state,
        shippingCountry: action.payload,
      };
    case 'setBillingCountry':
      return {
        ...state,
        billingCountry: action.payload,
      };
    case 'setCategories':
      return {
        ...state,
        categories: action.payload,
      };
    case 'setProducts':
      return {
        ...state,
        products: action.payload,
      };
    default:
      return state;
  }
};
