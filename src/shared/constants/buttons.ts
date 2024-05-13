export const BUTTON_TYPE = {
  BUTTON: 'button',
  RESET: 'reset',
  SUBMIT: 'submit',
} as const;

export const BUTTON_TEXT = {
  en: {
    BACK_TO_MAIN: 'Back to main',
    EDIT_INFO: 'Edit info',
    LOG_OUT: 'Log out',
    LOGIN: 'Login',
    REGISTRATION: 'Register',
  },
  ru: {
    BACK_TO_MAIN: 'Вернуться на главную',
    EDIT_INFO: 'Редактировать',
    LOG_OUT: 'Выйти',
    LOGIN: 'Войти',
    REGISTRATION: 'Регистрация',
  },
} as const;

export const BUTTON_TEXT_KEYS = {
  BACK_TO_MAIN: 'BACK_TO_MAIN',
  EDIT_INFO: 'EDIT_INFO',
  LOG_OUT: 'LOG_OUT',
  LOGIN: 'LOGIN',
  REGISTRATION: 'REGISTRATION',
} as const;

export type ButtonTextKeysType = (typeof BUTTON_TEXT_KEYS)[keyof typeof BUTTON_TEXT_KEYS];

export const IS_DISABLED = {
  DISABLED: true,
  ENABLED: false,
} as const;

export const LANGUAGE_CHOICE = {
  EN: 'en',
  RU: 'ru',
} as const;

export type LanguageChoiceType = (typeof LANGUAGE_CHOICE)[keyof typeof LANGUAGE_CHOICE];

export const MORE_TEXT = {
  en: { HIDE: 'Hide', MORE: 'More' },
  ru: { HIDE: 'Скрыть', MORE: 'Подробнее' },
};

export const MORE_TEXT_KEYS = {
  HIDE: 'HIDE',
  MORE: 'MORE',
};

export type MoreTextKeysType = (typeof MORE_TEXT_KEYS)[keyof typeof MORE_TEXT_KEYS];
