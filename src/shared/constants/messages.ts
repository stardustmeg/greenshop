export const MESSAGE_STATUS = {
  ERROR: 'error',
  SUCCESS: 'success',
} as const;

export type MessageStatusType = (typeof MESSAGE_STATUS)[keyof typeof MESSAGE_STATUS];

export const MESSAGE_STATUS_KEYS = {
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS',
} as const;

export type MessageStatusKeysType = (typeof MESSAGE_STATUS_KEYS)[keyof typeof MESSAGE_STATUS_KEYS];

export const SERVER_MESSAGE = {
  en: {
    BAD_REQUEST: 'Sorry, something went wrong. Try again later.',
    COPY_TO_CLIPBOARD: 'SKU copied to clipboard',
    GREETING: 'Hi! Welcome to our store. Enjoy shopping!',
    INCORRECT_PASSWORD: 'Please, enter a correct password',
    INVALID_EMAIL: "User with this email doesn't exist. Please, register first",
    LANGUAGE_CHANGED: 'Language preferences have been updated successfully',
    PASSWORD_CHANGED: 'Your password has been changed successfully',
    PASSWORD_NOT_CHANGED: 'Your password has not been changed. Please, try again',
    PERSONAL_INFO_CHANGED: 'Personal information has been changed successfully',
    SUCCESSFUL_ADD_PRODUCT_TO_CART: 'Product has been added successfully to your cart',
    SUCCESSFUL_ADD_PRODUCT_TO_WISHLIST: 'Product has been added successfully to your wishlist',
    SUCCESSFUL_DELETE_PRODUCT_FROM_CART: 'Product has been deleted successfully from your cart',
    SUCCESSFUL_DELETE_PRODUCT_FROM_WISHLIST: 'Product has been deleted successfully from your wishlist',
    SUCCESSFUL_LOGIN: 'Welcome to our store. Enjoy shopping!',
    SUCCESSFUL_REGISTRATION: 'Your registration was successful',
    USER_EXISTS: 'User with this email already exists, please check your email',
  },
  ru: {
    BAD_REQUEST: 'Извините, что-то пошло не так. Попробуйте позже.',
    COPY_TO_CLIPBOARD: 'SKU скопирован в буфер обмена',
    GREETING: 'Здравствуйте! Добро пожаловать в наш магазин. Приятных покупок!',
    INCORRECT_PASSWORD: 'Пожалуйста, введите правильный пароль',
    INVALID_EMAIL: 'Пользователь с таким адресом не существует. Пожалуйста, сначала зарегистрируйтесь',
    LANGUAGE_CHANGED: 'Настройки языка успешно обновлены',
    PASSWORD_CHANGED: 'Ваш пароль был успешно изменен',
    PASSWORD_NOT_CHANGED: 'Ваш пароль не был изменен. Пожалуйста, попробуйте ещё раз',
    PERSONAL_INFO_CHANGED: 'Персональные данные были успешно изменены',
    SUCCESSFUL_ADD_PRODUCT_TO_CART: 'Товар был успешно добавлен в корзину',
    SUCCESSFUL_ADD_PRODUCT_TO_WISHLIST: 'Товар был успешно добавлен в избранное',
    SUCCESSFUL_DELETE_PRODUCT_FROM_CART: 'Товар был успешно удален из корзины',
    SUCCESSFUL_DELETE_PRODUCT_FROM_WISHLIST: 'Товар был успешно удален из избранного',
    SUCCESSFUL_LOGIN: 'Добро пожаловать в наш магазин. Приятных покупок!',
    SUCCESSFUL_REGISTRATION: 'Регистрация прошла успешно',
    USER_EXISTS: 'Пользователь с таким адресом уже существует, пожалуйста, проверьте свою почту',
  },
} as const;

export const SERVER_MESSAGE_KEYS = {
  BAD_REQUEST: 'BAD_REQUEST',
  COPY_TO_CLIPBOARD: 'COPY_TO_CLIPBOARD',
  GREETING: 'GREETING',
  INCORRECT_PASSWORD: 'INCORRECT_PASSWORD',
  INVALID_EMAIL: 'INVALID_EMAIL',
  LANGUAGE_CHANGED: 'LANGUAGE_CHANGED',
  PASSWORD_CHANGED: 'PASSWORD_CHANGED',
  PASSWORD_NOT_CHANGED: 'PASSWORD_NOT_CHANGED',
  PERSONAL_INFO_CHANGED: 'PERSONAL_INFO_CHANGED',
  SUCCESSFUL_ADD_PRODUCT_TO_CART: 'SUCCESSFUL_ADD_PRODUCT_TO_CART',
  SUCCESSFUL_ADD_PRODUCT_TO_WISHLIST: 'SUCCESSFUL_ADD_PRODUCT_TO_WISHLIST',
  SUCCESSFUL_DELETE_PRODUCT_FROM_CART: 'SUCCESSFUL_DELETE_PRODUCT_FROM_CART',
  SUCCESSFUL_DELETE_PRODUCT_FROM_WISHLIST: 'SUCCESSFUL_DELETE_PRODUCT_FROM_WISHLIST',
  SUCCESSFUL_LOGIN: 'SUCCESSFUL_LOGIN',
  SUCCESSFUL_REGISTRATION: 'SUCCESSFUL_REGISTRATION',
  USER_EXISTS: 'USER_EXISTS',
} as const;

export type ServerMessageKeysType = (typeof SERVER_MESSAGE_KEYS)[keyof typeof SERVER_MESSAGE_KEYS];

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
