export const BUTTON_TYPE = {
  BUTTON: 'button',
  RESET: 'reset',
  SUBMIT: 'submit',
} as const;

export const BUTTON_TEXT = {
  en: {
    ADD_PRODUCT: 'Add to cart',
    BACK_TO_MAIN: 'Back to main',
    CANCEL: 'Cancel',
    DELETE_PRODUCT: 'Remove from cart',
    EDIT_INFO: 'Edit',
    LOG_OUT: 'Log out',
    LOGIN: 'Login',
    REGISTRATION: 'Register',
    RESET: 'Reset',
    SAVE_CHANGES: 'Save changes',
  },
  ru: {
    ADD_PRODUCT: 'Добавить в корзину',
    BACK_TO_MAIN: 'Вернуться на главную',
    CANCEL: 'Отмена',
    DELETE_PRODUCT: 'Удалить из корзины',
    EDIT_INFO: 'Редактировать',
    LOG_OUT: 'Выйти',
    LOGIN: 'Войти',
    REGISTRATION: 'Регистрация',
    RESET: 'Сбросить',
    SAVE_CHANGES: 'Сохранить',
  },
} as const;

export const BUTTON_TEXT_KEYS = {
  ADD_PRODUCT: 'ADD_PRODUCT',
  BACK_TO_MAIN: 'BACK_TO_MAIN',
  CANCEL: 'CANCEL',
  DELETE_PRODUCT: 'DELETE_PRODUCT',
  EDIT_INFO: 'EDIT_INFO',
  LOG_OUT: 'LOG_OUT',
  LOGIN: 'LOGIN',
  REGISTRATION: 'REGISTRATION',
  RESET: 'RESET',
  SAVE_CHANGES: 'SAVE_CHANGES',
} as const;

export type ButtonTextKeysType = (typeof BUTTON_TEXT_KEYS)[keyof typeof BUTTON_TEXT_KEYS];

export const IS_DISABLED = {
  DISABLED: true,
  ENABLED: false,
} as const;

export const MORE_TEXT = {
  en: { HIDE: 'Hide', MORE: 'More' },
  ru: { HIDE: 'Скрыть', MORE: 'Подробнее' },
};

export const MORE_TEXT_KEYS = {
  HIDE: 'HIDE',
  MORE: 'MORE',
};

export type MoreTextKeysType = (typeof MORE_TEXT_KEYS)[keyof typeof MORE_TEXT_KEYS];
