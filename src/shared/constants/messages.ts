export const MESSAGE_STATUS = {
  ERROR: 'error',
  SUCCESS: 'success',
} as const;

export type MessageStatusType = (typeof MESSAGE_STATUS)[keyof typeof MESSAGE_STATUS];

export const SERVER_MESSAGE = {
  INCORRECT_PASSWORD: 'Please, enter a correct password',
  INCORRECT_REGISTRATION: 'User with this email already exists, please check your email',
  INVALID_EMAIL: "User with this email doesn't exist. Please, register first",
  SUCCESSFUL_LOGIN: 'Welcome! And enjoy shopping!',
  SUCCESSFUL_REGISTRATION: 'Your registration was successful',
} as const;

export const ERROR_MESSAGE = {
  INVALID_COUNTRY: 'Invalid country',
  INVALID_POSTAL_CODE: 'Invalid postal code',
  REQUIRED_FIELD: 'Field is required',
  WRONG_REGION: "Sorry, we don't deliver to your region yet",
} as const;
