export const PAGE_LINK_TEXT = {
  LOGIN: 'Login',
  MAIN: 'Main',
  REGISTRATION: 'Register',
} as const;

export const PAGE_DESCRIPTION = {
  404: 'This is not the page you are looking for. Please go back to the main page.',
  LOGIN: 'Enter your email and password to login.',
  REGISTRATION: 'Enter your information to register.',
} as const;

export const PAGE_ID = {
  DEFAULT_PAGE: '',
  LOGIN_PAGE: 'login',
  MAIN_PAGE: 'main',
  NOT_FOUND_PAGE: '404',
  REGISTRATION_PAGE: 'register',
} as const;
