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
    SUCCESSFUL_LOGIN: 'Enjoy shopping!',
    SUCCESSFUL_REGISTRATION: 'Your registration was successful',
    USER_EXISTS: 'User with this email already exists, please check your email',
  },
  ru: {
    BAD_REQUEST: 'Извините, что-то пошло не так. Попробуйте еще раз позже.',
    INCORRECT_PASSWORD: 'Пожалуйста, введите правильный пароль',
    INVALID_EMAIL: 'Пользователь с таким email не существует. Пожалуйста, зарегистрируйтесь',
    SUCCESSFUL_LOGIN: 'Добро пожалуйста',
    SUCCESSFUL_REGISTRATION: 'Ваша регистрация прошла успешно',
    USER_EXISTS: 'Пользователь с таким email уже существует, пожалуйста, проверьте свой email',
  },
} as const;

export const ERROR_MESSAGE = {
  en: {
    INVALID_COUNTRY: 'Invalid country',
    INVALID_POSTAL_CODE: 'Invalid postal code',
    REQUIRED_FIELD: 'Field is required',
    WRONG_REGION: "Sorry, we don't deliver to your region yet",
  },
  ru: {
    INVALID_COUNTRY: 'Неверный код страны',
    INVALID_POSTAL_CODE: 'Неверный почтовый индекс',
    REQUIRED_FIELD: 'Поле обязательно для заполнения',
    WRONG_REGION: 'Извините, мы не доставляем в вашу область',
  },
} as const;

export const ERROR_MESSAGE_KEYS = {
  INVALID_COUNTRY: 'INVALID_COUNTRY',
  INVALID_POSTAL_CODE: 'INVALID_POSTAL_CODE',
  REQUIRED_FIELD: 'REQUIRED_FIELD',
  WRONG_REGION: 'WRONG_REGION',
} as const;
