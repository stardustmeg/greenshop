import type { User } from '../types/user';

/* eslint-disable import/prefer-default-export */
const ACTION = {
  SET_CURRENT_USER: 'setCurrentUser',
  SET_REGISTER_FORM_COUNTRY: 'setRegisterFormCountry',
} as const;

type ActionType = (typeof ACTION)[keyof typeof ACTION];

interface ActionWithPayload<T, U extends ActionType> {
  payload: T;
  type: U;
}

export const setCurrentUser = (value: User | null): ActionWithPayload<User | null, typeof ACTION.SET_CURRENT_USER> => ({
  payload: value,
  type: ACTION.SET_CURRENT_USER,
});

export const setRegisterFormCountry = (
  value: string,
): ActionWithPayload<string, typeof ACTION.SET_REGISTER_FORM_COUNTRY> => ({
  payload: value,
  type: ACTION.SET_REGISTER_FORM_COUNTRY,
});
