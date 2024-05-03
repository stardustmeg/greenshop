import type { UserInterface } from '../types/interfaces';

/* eslint-disable import/prefer-default-export */
const ACTION = {
  SET_BILLING_COUNTRY: 'setBillingCountry',
  SET_CURRENT_USER: 'setCurrentUser',
  SET_SHIPPING_COUNTRY: 'setShippingCountry',
} as const;

type ActionType = (typeof ACTION)[keyof typeof ACTION];

interface ActionWithPayload<T, U extends ActionType> {
  payload: T;
  type: U;
}

export const setCurrentUser = (
  value: UserInterface | null,
): ActionWithPayload<UserInterface | null, typeof ACTION.SET_CURRENT_USER> => ({
  payload: value,
  type: ACTION.SET_CURRENT_USER,
});

export const setBillingCountry = (value: string): ActionWithPayload<string, typeof ACTION.SET_BILLING_COUNTRY> => ({
  payload: value,
  type: ACTION.SET_BILLING_COUNTRY,
});

export const setShippingCountry = (value: string): ActionWithPayload<string, typeof ACTION.SET_SHIPPING_COUNTRY> => ({
  payload: value,
  type: ACTION.SET_SHIPPING_COUNTRY,
});
