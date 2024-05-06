export const BUTTON_TYPE = {
  BUTTON: 'button',
  RESET: 'reset',
  SUBMIT: 'submit',
} as const;

export const BUTTON_TEXT = {
  en: {
    LOG_OUT: 'Log out',
    LOGIN: 'Login',
    REGISTRATION: 'Register',
  },
  ru: {
    LOG_OUT: 'Выйти',
    LOGIN: 'Войти',
    REGISTRATION: 'Зарегистрироваться',
  },
} as const;

export const BUTTON_TEXT_KEYS = {
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
