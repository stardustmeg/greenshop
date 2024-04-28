/* eslint-disable import/prefer-default-export */
const ACTION = {
  SET_CURRENT_USER: 'setCurrentUser',
} as const;

type ActionType = (typeof ACTION)[keyof typeof ACTION];

interface ActionWithPayload<T, U extends ActionType> {
  payload: T;
  type: U;
}

export const setCurrentUser = (
  value: null | string,
): ActionWithPayload<null | string, typeof ACTION.SET_CURRENT_USER> => ({
  payload: value,
  type: ACTION.SET_CURRENT_USER,
});
