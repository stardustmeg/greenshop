export const MESSAGE_STATUS = {
  ERROR: 'error',
  SUCCESS: 'success',
} as const;

export type MessageStatusType = (typeof MESSAGE_STATUS)[keyof typeof MESSAGE_STATUS];

export const SERVER_MESSAGE = {
  en: {
    BAD_REQUEST: 'Sorry, something went wrong. Try again later.',
    INCORRECT_PASSWORD: 'Please, enter a correct password',
    INVALID_EMAIL: "User with this email doesn't exist. Please, register first",
    LANGUAGE_CHANGED: 'Language preferences have been updated successfully',
    SUCCESSFUL_LOGIN: 'Enjoy shopping!',
    SUCCESSFUL_REGISTRATION: 'Your registration was successful',
    USER_EXISTS: 'User with this email already exists, please check your email',
  },
  ru: {
    BAD_REQUEST: 'Извините, что-то пошло не так. Попробуйте позже.',
    INCORRECT_PASSWORD: 'Пожалуйста, введите правильный пароль',
    INVALID_EMAIL: 'Пользователь с таким адресом не существует. Пожалуйста, сначала зарегистрируйтесь',
    LANGUAGE_CHANGED: 'Настройки языка успешно обновлены',
    SUCCESSFUL_LOGIN: 'Приятных покупок!',
    SUCCESSFUL_REGISTRATION: 'Регистрация прошла успешно',
    USER_EXISTS: 'Пользователь с таким адресом уже существует, пожалуйста, проверьте свою почту',
  },
} as const;

export const SERVER_MESSAGE_KEYS = {
  BAD_REQUEST: 'BAD_REQUEST',
  INCORRECT_PASSWORD: 'INCORRECT_PASSWORD',
  INVALID_EMAIL: 'INVALID_EMAIL',
  LANGUAGE_CHANGED: 'LANGUAGE_CHANGED',
  SUCCESSFUL_LOGIN: 'SUCCESSFUL_LOGIN',
  SUCCESSFUL_REGISTRATION: 'SUCCESSFUL_REGISTRATION',
  USER_EXISTS: 'USER_EXISTS',
} as const;

export type ServerMessageKey = (typeof SERVER_MESSAGE_KEYS)[keyof typeof SERVER_MESSAGE_KEYS];

export const ERROR_MESSAGE = {
  en: {
    INVALID_COUNTRY: 'Invalid country',
    INVALID_POSTAL_CODE: 'Invalid postal code',
    REQUIRED_FIELD: 'Field is required',
    WRONG_REGION: "Sorry, we don't deliver to your region yet",
  },
  ru: {
    INVALID_COUNTRY: 'Неверная страна',
    INVALID_POSTAL_CODE: 'Неверный почтовый индекс',
    REQUIRED_FIELD: 'Поле обязательно для заполнения',
    WRONG_REGION: 'Извините, но мы еще не доставляем в ваш регион',
  },
} as const;

export const ERROR_MESSAGE_KEYS = {
  INVALID_COUNTRY: 'INVALID_COUNTRY',
  INVALID_POSTAL_CODE: 'INVALID_POSTAL_CODE',
  REQUIRED_FIELD: 'REQUIRED_FIELD',
  WRONG_REGION: 'WRONG_REGION',
} as const;
