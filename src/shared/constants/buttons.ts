export const BUTTON_TYPE = {
  BUTTON: 'button',
  RESET: 'reset',
  SUBMIT: 'submit',
} as const;

export const BUTTON_TEXT = {
  en: {
    BACK_TO_MAIN: 'Back to main',
    LOG_OUT: 'Log out',
    LOGIN: 'Login',
    REGISTRATION: 'Register',
  },
  ru: {
    BACK_TO_MAIN: 'Вернуться на главную',
    LOG_OUT: 'Выйти',
    LOGIN: 'Войти',
    REGISTRATION: 'Регистрация',
  },
} as const;

export const BUTTON_TEXT_KEYS = {
  BACK_TO_MAIN: 'BACK_TO_MAIN',
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
