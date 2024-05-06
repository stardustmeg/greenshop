export const PAGE_LINK_TEXT = {
  en: {
    LOGIN: 'Login',
    MAIN: 'Main',
    REGISTRATION: 'Register',
  },
  ru: {
    LOGIN: 'Вход',
    MAIN: 'Главная',
    REGISTRATION: 'Регистрация',
  },
} as const;

export const PAGE_LINK_TEXT_KEYS = {
  LOGIN: 'LOGIN',
  MAIN: 'MAIN',
  REGISTRATION: 'REGISTRATION',
} as const;

export const PAGE_DESCRIPTION = {
  en: {
    404: 'This is not the page you are looking for. Please go back to the main page.',
    GREETING: 'Hi, ',
    LOGIN: 'Enter your email and password to login.',
    REGISTRATION: 'Enter your information to register.',
  },
  ru: {
    404: 'Это не та страница, которую ты ищешь. Пожалуйста, вернись на главную страницу.',
    GREETING: 'Привет, ',
    LOGIN: 'Введите почту и пароль для входа.',
    REGISTRATION: 'Введите информацию о себе для регистрации.',
  },
} as const;

export const PAGE_DESCRIPTION_KEYS = {
  404: '404',
  GREETING: 'GREETING',
  LOGIN: 'LOGIN',
  REGISTRATION: 'REGISTRATION',
} as const;

export type PageDescriptionKeysType = (typeof PAGE_DESCRIPTION_KEYS)[keyof typeof PAGE_DESCRIPTION_KEYS];

export const PAGE_ANSWER = {
  en: {
    LOGIN: `Don't have an account yet?`,
    REGISTRATION: `Already have an account?`,
  },
  ru: {
    LOGIN: `Ещё нет аккаунта?`,
    REGISTRATION: `Уже есть аккаунт?`,
  },
} as const;

export const PAGE_ANSWER_KEYS = {
  LOGIN: 'LOGIN',
  REGISTRATION: 'REGISTRATION',
} as const;

export const PAGE_ID = {
  DEFAULT_PAGE: '',
  LOGIN_PAGE: 'login',
  MAIN_PAGE: 'main',
  NOT_FOUND_PAGE: '404',
  REGISTRATION_PAGE: 'register',
} as const;
