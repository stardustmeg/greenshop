export const BUTTON_TYPE = {
  BUTTON: 'button',
  RESET: 'reset',
  SUBMIT: 'submit',
} as const;

export const BUTTON_TEXT = {
  en: {
    BACK_TO_MAIN: 'Back to main',
    CANCEL: 'Cancel',
    EDIT_INFO: 'Edit',
    LOG_OUT: 'Log out',
    LOGIN: 'Login',
    NEW_ADDRESS: 'New address',
    REGISTRATION: 'Register',
    RESET: 'Reset',
    SAVE_CHANGES: 'Save changes',
  },
  ru: {
    BACK_TO_MAIN: 'Вернуться на главную',
    CANCEL: 'Отмена',
    EDIT_INFO: 'Редактировать',
    LOG_OUT: 'Выйти',
    LOGIN: 'Войти',
    NEW_ADDRESS: 'Новый адрес',
    REGISTRATION: 'Регистрация',
    RESET: 'Сбросить',
    SAVE_CHANGES: 'Сохранить',
  },
} as const;

export const BUTTON_TEXT_KEYS = {
  BACK_TO_MAIN: 'BACK_TO_MAIN',
  CANCEL: 'CANCEL',
  EDIT_INFO: 'EDIT_INFO',
  LOG_OUT: 'LOG_OUT',
  LOGIN: 'LOGIN',
  NEW_ADDRESS: 'NEW_ADDRESS',
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
