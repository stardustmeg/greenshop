export const MESSAGE_STATUS = {
  ERROR: 'error',
  SUCCESS: 'success',
} as const;

export type MessageStatusType = (typeof MESSAGE_STATUS)[keyof typeof MESSAGE_STATUS];

export const SERVER_MESSAGE = {
  BAD_REQUEST: 'Sorry, something went wrong. Try again later.',
  INCORRECT_PASSWORD: 'Please, enter a correct password',
  INVALID_EMAIL: "User with this email doesn't exist. Please, register first",
  SUCCESSFUL_LOGIN: 'Welcome! Enjoy shopping!',
  SUCCESSFUL_REGISTRATION: 'Your registration was successful',
  USER_EXISTS: 'User with this email already exists, please check your email',
} as const;

export const ERROR_MESSAGE = {
  INVALID_COUNTRY: 'Invalid country',
  INVALID_POSTAL_CODE: 'Invalid postal code',
  REQUIRED_FIELD: 'Field is required',
  WRONG_REGION: "Sorry, we don't deliver to your region yet",
} as const;
