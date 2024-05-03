export const MESSAGE_STATUS = {
  ERROR: 'error',
  SUCCESS: 'success',
} as const;

export type MessageStatusType = (typeof MESSAGE_STATUS)[keyof typeof MESSAGE_STATUS];

export const SERVER_MESSAGE = {
  INCORRECT_LOGIN: 'Incorrect login or password',
  INCORRECT_REGISTRATION: 'User with this email already exists, please check your email',
  SUCCESSFUL_LOGIN: 'Your login was successful',
  SUCCESSFUL_REGISTRATION: 'Your registration was successful',
} as const;

export const ERROR_MESSAGE = {
  INVALID_COUNTRY: 'Invalid country',
  INVALID_POSTAL_CODE: 'Invalid postal code',
  REQUIRED_FIELD: 'Field is required',
  WRONG_REGION: "Sorry, we don't deliver to your region yet",
} as const;
