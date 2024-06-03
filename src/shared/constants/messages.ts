import type { LanguageChoiceType } from './common';

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

export const SERVER_MESSAGE: Record<LanguageChoiceType, Record<string, string>> = {
  en: {
    ADDRESS_ADDED: 'Address has been added successfully',
    ADDRESS_CHANGED: 'Address has been changed successfully',
    ADDRESS_DELETED: 'Address has been deleted successfully',
    ADDRESS_STATUS_CHANGED: 'Address status has been changed successfully',
    BAD_REQUEST: 'Sorry, something went wrong. Try again later.',
    COPY_TO_CLIPBOARD: 'SKU copied to clipboard',
    GREETING: 'Hi! Welcome to our store. Enjoy shopping!',
    INCORRECT_PASSWORD: 'Please, enter a correct password',
    INVALID_COUPON: 'Invalid coupon',
    INVALID_EMAIL: "User with this email doesn't exist. Please, register first",
    LANGUAGE_CHANGED: 'Language preferences have been updated successfully',
    NEED_LOGIN: 'You need to log in to see this page',
    PASSWORD_CHANGED: 'Your password has been changed successfully',
    PASSWORD_NOT_CHANGED: 'Your password has not been changed. Please, try again',
    PERSONAL_INFO_CHANGED: 'Personal information has been changed successfully',
    SUCCESSFUL_ADD_COUPON_TO_CART: 'Coupon has been applied to your cart successfully',
    SUCCESSFUL_ADD_PRODUCT_TO_CART: 'Product has been added successfully to your cart',
    SUCCESSFUL_ADD_PRODUCT_TO_WISHLIST: 'Product has been added successfully to your wishlist',
    SUCCESSFUL_CLEAR_CART: 'Cart has been cleared successfully',
    SUCCESSFUL_COPY_TO_CLIPBOARD: 'SKU has been copied to clipboard',
    SUCCESSFUL_DELETE_PRODUCT_FROM_CART: 'Product has been deleted successfully from your cart',
    SUCCESSFUL_DELETE_PRODUCT_FROM_WISHLIST: 'Product has been deleted successfully from your wishlist',
    SUCCESSFUL_LOGIN: 'Welcome to our store. Enjoy shopping!',
    SUCCESSFUL_REGISTRATION: 'Your registration was successful',
    SUCCESSFUL_SUBSCRIBE: 'You have successfully subscribed to our newsletter',
    USER_EXISTS: 'User with this email already exists, please check your email',
  },
  ru: {
    ADDRESS_ADDED: 'Адрес успешно добавлен',
    ADDRESS_CHANGED: 'Адрес успешно изменен',
    ADDRESS_DELETED: 'Адрес успешно удален',
    ADDRESS_STATUS_CHANGED: 'Статус адреса успешно изменен',
    BAD_REQUEST: 'Извините, что-то пошло не так. Попробуйте позже.',
    COPY_TO_CLIPBOARD: 'SKU скопирован в буфер обмена',
    GREETING: 'Здравствуйте! Добро пожаловать в наш магазин. Приятных покупок!',
    INCORRECT_PASSWORD: 'Пожалуйста, введите правильный пароль',
    INVALID_COUPON: 'Неверный купон',
    INVALID_EMAIL: 'Пользователь с таким адресом не существует. Пожалуйста, сначала зарегистрируйтесь',
    LANGUAGE_CHANGED: 'Настройки языка успешно обновлены',
    NEED_LOGIN: 'Вам нужно войти, чтобы перейти на эту страницу',
    PASSWORD_CHANGED: 'Ваш пароль успешно изменен',
    PASSWORD_NOT_CHANGED: 'Ваш пароль не был изменен. Пожалуйста, попробуйте ещё раз',
    PERSONAL_INFO_CHANGED: 'Персональные данные успешно изменены',
    SUCCESSFUL_ADD_COUPON_TO_CART: 'Купон успешно применен к корзине',
    SUCCESSFUL_ADD_PRODUCT_TO_CART: 'Товар успешно добавлен в корзину',
    SUCCESSFUL_ADD_PRODUCT_TO_WISHLIST: 'Товар успешно добавлен в избранное',
    SUCCESSFUL_CLEAR_CART: 'Корзина была успешно очищена',
    SUCCESSFUL_COPY_TO_CLIPBOARD: 'SKU успешно скопирован в буфер обмена',
    SUCCESSFUL_DELETE_PRODUCT_FROM_CART: 'Товар успешно удален из корзины',
    SUCCESSFUL_DELETE_PRODUCT_FROM_WISHLIST: 'Товар успешно удален из избранного',
    SUCCESSFUL_LOGIN: 'Добро пожаловать в наш магазин. Приятных покупок!',
    SUCCESSFUL_REGISTRATION: 'Регистрация прошла успешно',
    SUCCESSFUL_SUBSCRIBE: 'Вы успешно подписались на рассылку новостей',
    USER_EXISTS: 'Пользователь с таким адресом уже существует, пожалуйста, проверьте свою почту',
  },
} as const;

export const SERVER_MESSAGE_KEYS: Record<string, string> = {
  ADDRESS_ADDED: 'ADDRESS_ADDED',
  ADDRESS_CHANGED: 'ADDRESS_CHANGED',
  ADDRESS_DELETED: 'ADDRESS_DELETED',
  ADDRESS_STATUS_CHANGED: 'ADDRESS_STATUS_CHANGED',
  BAD_REQUEST: 'BAD_REQUEST',
  COPY_TO_CLIPBOARD: 'COPY_TO_CLIPBOARD',
  GREETING: 'GREETING',
  INCORRECT_PASSWORD: 'INCORRECT_PASSWORD',
  INVALID_COUPON: 'INVALID_COUPON',
  INVALID_EMAIL: 'INVALID_EMAIL',
  LANGUAGE_CHANGED: 'LANGUAGE_CHANGED',
  NEED_LOGIN: 'NEED_LOGIN',
  PASSWORD_CHANGED: 'PASSWORD_CHANGED',
  PASSWORD_NOT_CHANGED: 'PASSWORD_NOT_CHANGED',
  PERSONAL_INFO_CHANGED: 'PERSONAL_INFO_CHANGED',
  SUCCESSFUL_ADD_COUPON_TO_CART: 'SUCCESSFUL_ADD_COUPON_TO_CART',
  SUCCESSFUL_ADD_PRODUCT_TO_CART: 'SUCCESSFUL_ADD_PRODUCT_TO_CART',
  SUCCESSFUL_ADD_PRODUCT_TO_WISHLIST: 'SUCCESSFUL_ADD_PRODUCT_TO_WISHLIST',
  SUCCESSFUL_CLEAR_CART: 'SUCCESSFUL_CLEAR_CART',
  SUCCESSFUL_COPY_TO_CLIPBOARD: 'SUCCESSFUL_COPY_TO_CLIPBOARD',
  SUCCESSFUL_DELETE_PRODUCT_FROM_CART: 'SUCCESSFUL_DELETE_PRODUCT_FROM_CART',
  SUCCESSFUL_DELETE_PRODUCT_FROM_WISHLIST: 'SUCCESSFUL_DELETE_PRODUCT_FROM_WISHLIST',
  SUCCESSFUL_LOGIN: 'SUCCESSFUL_LOGIN',
  SUCCESSFUL_REGISTRATION: 'SUCCESSFUL_REGISTRATION',
  SUCCESSFUL_SUBSCRIBE: 'SUCCESSFUL_SUBSCRIBE',
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
