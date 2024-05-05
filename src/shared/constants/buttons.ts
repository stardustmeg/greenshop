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

export const IS_DISABLED = {
  DISABLED: true,
  ENABLED: false,
} as const;

export const LANGUAGE_CHOICE = {
  EN: 'en',
  RU: 'ru',
} as const;
